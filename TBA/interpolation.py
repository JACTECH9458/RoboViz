def calcular_angulo(distancia, pontos):
    """
    Calcula o ângulo com base na distância usando interpolação linear por partes.
    
    Args:
    distancia (float): A distância do robô até o alvo.
    pontos (list of tuples): Lista de pontos (distância, ângulo) ordenados pela distância.
    
    Returns:
    float: O ângulo interpolado ou extrapolado.
    """
    # Ordena os pontos por distância, só para garantir
    pontos.sort(key=lambda x: x[0])
    
    # Verifica em qual intervalo a distância se encontra
    for i in range(len(pontos) - 1):
        d1, theta1 = pontos[i]
        d2, theta2 = pontos[i + 1]
        
        # Se a distância está entre dois pontos conhecidos, fazemos a interpolação
        if d1 <= distancia <= d2:
            return theta1 + ((distancia - d1) / (d2 - d1)) * (theta2 - theta1)
    
    # Se a distância está fora dos intervalos, extrapolamos
    if distancia < pontos[0][0]:
        # Extrapolação para distâncias menores que o primeiro ponto
        d1, theta1 = pontos[0]
        d2, theta2 = pontos[1]
    else:
        # Extrapolação para distâncias maiores que o último ponto
        d1, theta1 = pontos[-2]
        d2, theta2 = pontos[-1]
    
    # Extrapolação linear
    return theta1 + ((distancia - d1) / (d2 - d1)) * (theta2 - theta1)

# Exemplo de uso com três pontos de referência
pontos_referencia = [(2.053, 41.1), (2.55, 38.3), (3, 36.7), (4, 35.1)]

# Testando para uma distância dentro do intervalo
distancia_alvo = 3
angulo_resultante = calcular_angulo(distancia_alvo, pontos_referencia)

print(f"O ângulo para a distância de {distancia_alvo} metros é {angulo_resultante:.2f} graus.")
