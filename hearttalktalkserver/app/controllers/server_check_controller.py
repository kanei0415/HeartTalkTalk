from flask import render_template
from app import app

@app.route('/')
def health_check():
  return render_template('index.html')