require 'fileutils'

jake :version do
  begin
    svn_info = `svn info`.split("\n")
    url = svn_info.find { |info| info =~ /^URL/i }
    revision = svn_info.find { |info| info =~ /^Revision/i }
    if url and revision
      return url.scan(/[^\/]+/).last if url =~ /\/tags\/[^\/]+\/?$/
      return 'rev.' + revision.scan(/\d+/).first
    else
      return ""
    end
  rescue
    return ""
  end
end

jake :after_build do |build|
  %w(README LICENSE CHANGELOG).each do |doc|
    FileUtils.copy doc, "#{ build.build_directory }/../#{ doc }"
  end
  
  FileUtils.mkdir_p 'site/site/javascripts/ojay'
  
  all = build.package(:all)
  
  FileUtils.copy all.build_path(:min), 'site/site/javascripts/ojay/all-min.js'
  FileUtils.copy all.build_path(:source), 'site/site/javascripts/ojay/all.js'
  
  FileUtils.copy 'site/site/javascripts/yui/2.6.0.js', "#{ build.build_directory }/../yui.js"
end

