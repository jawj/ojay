require 'rake'
require 'fileutils'
require 'yaml'
require 'packr'

config = YAML.load(File.read('build.yml'))

task :default do
  if ENV['q']
    Rake::Task[:grape].invoke
  else
    Rake::Task[:build].invoke
  end
end

task :build => [:destroy, :create_directory] do
  copyright = File.read('COPYRIGHT')
  builds = {:src => {}, :min => {}, :pack => {}}
  
  config['packages'].each do |name, package|
    pack_private = package['encode_private_vars']
    builds[:src][name] = package['files'].map { |f| File.read("#{config['source_dir']}/#{package['source_dir']}/#{f}.js") }.join("\n")
    builds[:min][name] = Packr.pack(builds[:src][name], :shrink_vars => true, :private => pack_private)
    builds[:pack][name] = Packr.pack(builds[:min][name], :base62 => true)
  end
  
  builds[:src]['all'] = config['all'].map { |p| builds[:src][p] }.join("\n")
  builds[:min]['all'] = config['all'].map { |p| builds[:min][p] }.join("\n")
  builds[:pack]['all'] = Packr.pack(builds[:min]['all'], :base62 => true)
  
  builds[:src].each do |name, code|
    min = "#{name}-min"
    
    { "min/#{name}" => code,
      "min/#{min}" => builds[:min][name],
      "gzip/#{name}" => code,
      "gzip/#{min}" => builds[:min][name],
      "pack/#{name}" => code,
      "pack/#{min}" => builds[:pack][name]
    }.each do |path, code|
      
      full_path = "#{config['build_dir']}/#{path}.js"
      FileUtils.mkdir_p(File.dirname(full_path))
      data = ((name == 'all' || config['packages'][name]['include_copyright']) ? copyright : '') + code
      File.open(full_path, 'wb') { |f| f.write(data) }
      puts " * Built #{path}, #{(File.size(full_path) / 1024).to_i} kb"
    end
  end
  
  %w(README LICENSE).each do |doc|
    File.__send__(:copy, doc, "#{config['build_dir']}/#{doc}")
  end
  
  FileUtils.mkdir_p('site/site/javascripts/ojay')
  # copy is private in some versions
  File.__send__(:copy, "#{config['build_dir']}/pack/all-min.js", 'site/site/javascripts/ojay/all.js')
end

task :create_directory do
  FileUtils.mkdir_p(config['build_dir']) unless File.directory?(config['build_dir'])
end

task :destroy do
  %w(min pack gzip).each do |build|
    dir = "#{config['build_dir']}/#{build}"
    puts " * Removing #{dir}"
    FileUtils.rm_rf(dir) if File.directory?(dir)
  end
end

desc "Searches all project files and lists those whose contents match the regexp"
task :grape do
  require 'grape'
  grape = Grape.new(:dir => '.', :excluded_dirs => %w(build site/site/javascripts/yui site/site/javascripts/ojay),
      :extensions => %w(js html haml))
  results = grape.search(ENV['q'],
    :case_sensitive => !!ENV['cs'],
    :verbose => !!ENV['v'],
    :window => ENV['v']
  )
  grape.print_results(results)
end
