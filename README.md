Ojay
====

[Ojay][ojay] is a developer-friendly wrapper for the Yahoo! User Interface
library.

Copyright (c) 2007-11 the OTHER media Limited, written by James Coglan.

Ojay is open source software released under the BSD license. Please see the
`LICENSE` file for more details.


Introduction
------------

Ojay is a JavaScript programming interface that wraps the Yahoo! User Interface
library. It aims to make code easier to read and write, by allowing more
sentence-like OO syntax and minimising repetition.

The download contains two copies of all files; one containing the full source
code and one minified for production use. For best performance, it is
recommended that you serve the minified files on live sites, and use
gzip/deflate compression. You can do this by enabling `mod_deflate` in Apache
and adding this line to your site's config:

    AddOutputFilterByType DEFLATE text/javascript application/x-javascript

Ojay's build files are generated using [Jake][jake], a Ruby program that uses
Dean Edwards' Packer to compress code. The download also contains a file named
`yui.js`, which contains all the [YUI][yui] build files used by Ojay in one
concatenated file. It includes the following:

  * yahoo-dom-event
  * selector
  * json
  * animation
  * connection
  * get
  * cookie
  * history

Further information and documentation is available on [the Ojay site][ojay].


Development
-----------

If you're checking this code out from the repository, you'll need to build the
library from the source files (contained in the `/source` directory). To do
this, you'll need Ruby installed. You can get Ruby for any platform from
[their web site][ruby].

You'll also need the Jake gem to generate build files, and the
[StaticMatic][stat] gem to view the documentation site and run tests.

    gem install jake
    gem install staticmatic

Once you've got Ruby installed, open a command prompt in the root directory
(one level up from `/source`) and type `jake`. That command will combine and
compress the source files and place them in the `/build` directory.

To start a server for the docs/test site, type

    staticmatic preview site

The site is then available at `http://localhost:3030`, and the test suite at
`http://localhost:3030/test/`.

[ojay]: http://ojay.othermedia.org
[jake]: http://github.com/jcoglan/jake
[yui]:  http://developer.yahoo.com/yui/
[ruby]: http://www.ruby-lang.org/en/downloads/
[stat]: http://www.staticmatic.net/
