import os, socketio, requests, json
from pymongo import MongoClient


# Function to send data using WebSockets
def send_via_websocket(data):
    # Create a Socket.IO client
    sio = socketio.Client()

    @sio.event
    def connect():
        print("WebSocket connection established")
        sio.emit('chat_message', data)
        print("Message sent via WebSocket, disconnecting...")
        sio.sleep(1)  # Ensure message is sent
        sio.disconnect()

    @sio.event
    def disconnect():
        print("WebSocket disconnected from server")

    sio.connect(websockets_url)
    sio.wait()


# Function to send data via HTTP POST request
def send_via_http(data, url):
    response = requests.delete(url + "delete/" + str(data))
    print(f"HTTP Response status code: {response.status_code}")
    print(f"HTTP Response content: {response.text}")


def send_via_http_delete():
    data = {
        "username": "root",
        "password": "12345"
    }

    headers = {
        'Content-Type': 'application/json'
    }

    # Convert the data to JSON format
    json_data = json.dumps(data)

    response = requests.post(api_url + "login", headers=headers, data=json_data)
    response = json.loads(response.text)

    print(response['data']['token'])

    if response['status'] != True:
        print("Login failed")
        return

    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + response['data']['token']
    }

    response = requests.delete(storage_url + "deleteall", headers=headers)

    if response.status_code != 202:
        print("HTTP Response status code: " + str(response.status_code))
        print("HTTP Response content: " + str(response.text))
    else:
        print("HTTP Response status code: " + str(response.status_code))
        print("HTTP Response content: " + str(response.text))

        client = MongoClient("mongodb://mongodb:27017/")
        #client = MongoClient(os.environ['DATABASE_URI'])
        db = client.ChatDB
        db.images.drop()
        db.messages.drop()

        sio = socketio.Client()

        @sio.event
        def connect():
            print("WebSocket connection established")

            countdown = 5
            for i in range(1, 6):
                sio.emit('chat_message', {
                    'name': "Server",
                    'msg': "All deleted in: " + str(countdown) + " " + death_smile,
                    'type': "O"
                })
                countdown -= 1
                sio.sleep(1)

            sio.emit('chat_message', {
                'name': "DELETE",
                'msg': "DELETE",
                'type': "DELETE"
            })
            print("Message sent via WebSocket, disconnecting...")
            sio.sleep(5)  # Ensure message is sent
            sio.disconnect()

        @sio.event
        def disconnect():
            print("WebSocket disconnected from server")

        sio.connect(websockets_url)
        sio.wait()


if __name__ == "__main__":
    # Define the URL for the HTTP request
    websockets_url = 'http://cloudwebsockets:3001'
    api_url = "http://cloudapi:3002/"
    # api_url = "http://localhost:3002/"
    storage_url = "http://cloudstorage:3003/"

    smile = "\u00f0\u009f\u0098\u0086".encode("latin-1").decode("utf-8")
    death_smile = "\U0001F480".encode("utf-8").decode("latin-1").encode("latin-1").decode("utf-8")
    # Define the object to emit
    websockets_data = {
        'name': "Server",
        'msg': "Everything will be deleted in: ",
        'type': "O"
    }

    # Send data using WebSocket
    # send_via_websocket(websockets_data)

    # Send data using HTTP POST request
    # send_via_http("TESP.png", storage_url)

    send_via_http_delete()
