import os
import http.server
import socketserver
import mimetypes

mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

class RangeRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def send_head(self):
        if 'Range' not in self.headers:
            return super().send_head()

        try:
            path = self.translate_path(self.path)
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None

        fs = os.fstat(f.fileno())
        size = fs[6]
        
        range_header = self.headers['Range']
        range_match = range_header.replace('bytes=', '').split('-')
        
        first_byte = int(range_match[0])
        last_byte = int(range_match[1]) if len(range_match) > 1 and range_match[1] else size - 1
        
        if first_byte >= size or last_byte >= size:
            self.send_error(416, 'Requested Range Not Satisfiable')
            return None
            
        length = last_byte - first_byte + 1

        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Range', f'bytes {first_byte}-{last_byte}/{size}')
        self.send_header('Content-Length', str(length))
        self.send_header('Last-Modified', self.date_time_string(fs.st_mtime))
        self.end_headers()
        
        return f

    def copyfile(self, source, outputfile):
        if 'Range' not in self.headers:
            super().copyfile(source, outputfile)
            return

        range_header = self.headers['Range']
        range_match = range_header.replace('bytes=', '').split('-')
        first_byte = int(range_match[0])
        
        fs = os.fstat(source.fileno())
        size = fs[6]
        last_byte = int(range_match[1]) if len(range_match) > 1 and range_match[1] else size - 1
        length = last_byte - first_byte + 1

        source.seek(first_byte)
        
        # Write chunks
        remaining = length
        while remaining > 0:
            chunk = source.read(min(remaining, 64 * 1024))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)

PORT = 8000
Handler = RangeRequestHandler
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Serving at port", PORT)
    httpd.serve_forever()
