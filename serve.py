import http.server
import os
os.chdir("/Users/jcv/Documents/fidelavis")
http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler, port=8080)
