from flask import Flask, request, jsonify
from flask_cors import CORS
from lang_agent import get_gemini_response

app = Flask(__name__)
CORS(app)

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        user_input = request.json.get("message", "")
        if not user_input:
            return jsonify({"error": "Empty message"}), 400

        response = get_gemini_response(user_input)
        return jsonify({"response": response})

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
