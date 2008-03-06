require 'rake'
require 'fileutils'

priv = %w(priv)
reserved = priv

COPYRIGHT = File.read('COPYRIGHT')

SOURCE_DIR = 'source'
PACKAGE_DIR = 'build'
PACKAGES = {
  'lib/class'       => %w(class method_chain observable state).map { |s| "external/#{s}" },
  
  'core' => priv + %w(
    core/core               core/utils
    core/array              core/function
    core/string             core/number
    external/reiterate      core/event
    core/dom_collection     core/dom_insertion
    core/html_builder       core/animation
    core/region             core/sequence
    core/method_chain
  ),
  
  'pkg/http'        => priv + %w(ajax cross_domain).map { |s| "packages/http/#{s}" },
  'pkg/forms'       => priv + %w(begin validators description requirement dsl button_states radio_buttons checkbox end).map { |s| "packages/forms/#{s}" },
  'pkg/history'     => priv + %w(packages/history/history),
  'pkg/keyboard'    => priv + %w(begin utils keyboard rules monitor disabler events end).map { |s| "packages/keyboard/#{s}" },
  'pkg/mouse'       => priv + %w(packages/mouse/mouse),
  'pkg/overlay'     => priv + %w(begin overlay transitions page_mask end).map { |s| "packages/overlay/#{s}" }
}

ALL_PACKAGES = %w(lib/class lib/observable core pkg/http pkg/forms pkg/history pkg/keyboard pkg/mouse pkg/overlay)

task :default do
  if ENV['q']
    Rake::Task[:grape].invoke
  else
    Rake::Task[:build].invoke
  end
end

task :build => [:destroy, :create_directory] do
  require 'packr'
  builds = {:src => {}, :min => {}, :pack => {}}
  PACKAGES.each do |name, sources|
    pack_private = sources.include?('priv')
    files = sources.find_all { |s| !reserved.include?(s) }
    builds[:src][name] = files.map { |f| File.read("#{SOURCE_DIR}/#{f}.js") }.join("\n")
    builds[:min][name] = Packr.pack(builds[:src][name], :shrink_vars => true, :private => pack_private)
    builds[:pack][name] = Packr.pack(builds[:min][name], :base62 => true)
  end
  
  builds[:src][:all] = ALL_PACKAGES.map { |p| builds[:src][p] }.join("\n")
  builds[:min][:all] = ALL_PACKAGES.map { |p| builds[:min][p] }.join("\n")
  builds[:pack][:all] = Packr.pack(builds[:min][:all], :base62 => true)
  
  builds[:src].each do |name, code|
    min = "#{name}-min"
    
    { "min/#{name}" => code,
      "min/#{min}" => builds[:min][name],
      "gzip/#{name}" => code,
      "gzip/#{min}" => builds[:min][name],
      "pack/#{name}" => code,
      "pack/#{min}" => builds[:pack][name]
    }.each do |path, code|
      full_path = "#{PACKAGE_DIR}/#{path}.js"
      FileUtils.mkdir_p(full_path.gsub(/[^\/]*$/, ''))
      data = (File.dirname(full_path) =~ /\/lib$/ ? '' : COPYRIGHT) + code
      File.open(full_path, 'wb') { |f| f.write(data) }
      puts " * Built #{path}, #{(File.size(full_path) / 1024).to_i} kb"
    end
  end
  
  %w(README LICENSE).each do |doc|
    File.__send__(:copy, doc, "#{PACKAGE_DIR}/#{doc}")
  end
  
  FileUtils.mkdir_p('site/site/javascripts/ojay')
  # copy is private in some versions
  File.__send__(:copy, "#{PACKAGE_DIR}/pack/all-min.js", 'site/site/javascripts/ojay/all.js')
end

task :create_directory do
  FileUtils.mkdir_p(PACKAGE_DIR) unless File.directory?(PACKAGE_DIR)
end

task :destroy do
  %w(min pack gzip).each do |build|
    dir = "#{PACKAGE_DIR}/#{build}"
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
