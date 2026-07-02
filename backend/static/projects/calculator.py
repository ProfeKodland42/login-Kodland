# calculadora.py
print("CALCULADORA")

while True:
    print("\n1=Suma  2=Resta  3=Multiplica  4=Divide  5=Salir")
    op = input("Elige: ")
    
    if op == "5":
        break
    
    n1 = float(input("Número: "))
    n2 = float(input("Número: "))
    
    if op == "1":
        print(n1 + n2)
    elif op == "2":
        print(n1 - n2)
    elif op == "3":
        print(n1 * n2)
    elif op == "4":
        if n2 == 0:
            print("Error")
        else:
            print(n1 / n2)
    else:
        print("Elige 1,2,3,4 o 5")