from flask import render_template
from VITCHAT import app

@app.route("/")
@app.route("/home")
def home():
    return render_template("index.html")
