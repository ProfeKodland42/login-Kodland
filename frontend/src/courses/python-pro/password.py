# generador.py
import random

print("🔐 GENERADOR DE CONTRASEÑAS")

print("\nElige:")
print("1. Solo números")
print("2. Letras y números")
print("3. Fuerte (letras, números y símbolos)")

opcion = input("Opción (1-3): ")
largo = int(input("Largo (8-20): "))

if opcion == "1":
    caracteres = "0123456789"
elif opcion == "2":
    caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
else:
    caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*"
password = ""
for i in range(largo):
    password = password + random.choice(caracteres)

print("\n🔑 Contraseña:", password)