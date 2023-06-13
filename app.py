from flask import Flask,render_template,request,jsonify
from chat import get_responses

app = Flask(__name__)

@app.get("/")
def home():
    return render_template("index.html")

@app.post("/work")
def work():
    text = request.get_json().get("message")
    response = get_responses(text)
    message = {"answer":response}
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True)
    

