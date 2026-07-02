# chatbot.py
import random

print("🤖 CHATBOT")
print("Escribe 'salir' para terminar")
while True:
    msg = input("\nTú: ")

    if msg == "salir":
        print("Bot: ¡Chao!")
        break

    respuestas = [
        "¡Qué interesante!",
        "Cuéntame más",
        "No sabía eso",
        "¡Genial!",
        "¿En serio?",
        "Claro, entiendo"
    ]
    print("Bot:", random.choice(respuestas))