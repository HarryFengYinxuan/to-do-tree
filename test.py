from socket import socket, AF_INET, SOCK_STREAM
p = socket(AF_INET, SOCK_STREAM)
p.connect(('localhost', 60000))
while 1:
    p.send(b'hello')
    print(p.recv(1024))