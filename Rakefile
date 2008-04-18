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
  builds = {:src => {}, :min => {}, :pack => {}}
  
  config['packages'].each do |name, package|
    pack_private = package['encode_private_vars']
    
    builds[:src][name] = package['files'].map { |f| File.read("#{config['source_dir']}/#{package['source_dir']}/#{f}.js") }.join("\n")
    builds[:src][name] += "\nOjay.VERSION = '#{get_version}';\n" if package['include_version']
    
    builds[:min][name] = Packr.pack(builds[:src][name], :shrink_vars => true, :private => pack_private)
    builds[:pack][name] = Packr.pack(builds[:min][name], :base62 => true)
  end
  
  builds[:src]['all'] = config['all']['files'].map { |p| builds[:src][p] }.join("\n")
  builds[:min]['all'] = config['all']['files'].map { |p| builds[:min][p] }.join("\n")
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
      
      copyright = (name == 'all') ? config['all']['copyright'] : config['packages'][name]['copyright']
      copyright = File.file?(copyright.to_s) ? File.read(copyright) : ''
      
      requires = (name != 'all' and require_list = config['packages'][name]['requires']) ?
          require_list.map { |r| "// @require #{r}" }.join("\n") + "\n" :
          ''
      
      File.open(full_path, 'wb') { |f| f.write("#{copyright}#{requires}#{code}") }
      puts " * Built #{path}, #{(File.size(full_path) / 1024).to_i} kb"
    end
  end
  
  %w(README LICENSE).each do |doc|
    File.__send__(:copy, doc, "#{config['build_dir']}/#{doc}")
  end
  
  FileUtils.mkdir_p('site/site/javascripts/ojay')
  File.__send__(:copy, "#{config['build_dir']}/pack/all-min.js", 'site/site/javascripts/ojay/all-min.js')
  File.__send__(:copy, "#{config['build_dir']}/pack/all.js", 'site/site/javascripts/ojay/all.js')
  File.__send__(:copy, 'site/site/javascripts/yui/2.5.1.js', "#{config['build_dir']}/yui.js")
end

def get_version
  svn_info = `svn info`.split("\n")
  url = svn_info.find { |info| info =~ /^URL/i }
  revision = svn_info.find { |info| info =~ /^Revision/i }
  if url and revision
    puts "Building #{url}, #{revision}"
    return url.scan(/[\d\.]+/).last if url =~ /[\d\.]+\/?$/
    return 'rev.' + revision.scan(/\d+/).first
  else
    return ""
  end
rescue
  return ""
end

task :create_directory do
  FileUtils.mkdir_p(config['build_dir']) unless File.directory?(config['build_dir'])
end

task :destroy do
  build_dir = config['build_dir']
  if File.directory?(build_dir)
    Dir.entries(build_dir).each do |dir|
      FileUtils.rm_rf("#{build_dir}/#{dir}") unless dir =~ /^\./
    end
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
