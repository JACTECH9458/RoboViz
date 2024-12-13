import requests
import pandas as pd
import tkinter as tk
from tkinter import ttk

# Substitua pela sua chave da API
api_key = 'PuOcSmeQNGxSL2HYJjgyOhm21CGafJjfrmfGZpR4R08nqk7xdRflJJFzPKZp4gOc'
# Chave da divisão Galileo para o Campeonato de 2024
year = '2018'
url = f'https://www.thebluealliance.com/api/v3/events/{year}/keys'

headers = {
    'X-TBA-Auth-Key': api_key
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    events_keys = response.json()  # Obter a lista de chaves de eventos

    event_data_list = []  # Lista para armazenar os dados de eventos

    # Iterar sobre cada chave de evento e obter os detalhes
    for event_key in events_keys:
        event_url = f'https://www.thebluealliance.com/api/v3/event/{event_key}'
        event_response = requests.get(event_url, headers=headers)

        if event_response.status_code == 200:
            event_data = event_response.json()  # Obter os dados do evento
            event_data_list.append(event_data)  # Adicionar os dados do evento à lista
        else:
            print(f"Erro ao obter dados do evento {event_key}: {event_response.status_code}")

    # Converter a lista de dados de eventos em um DataFrame do Pandas
    df_events = pd.DataFrame(event_data_list)

    # Verifique quais colunas estão disponíveis no DataFrame
    print("Colunas disponíveis:", df_events.columns.tolist())

    # Criar a janela principal do Tkinter
    root = tk.Tk()
    root.title("Eventos da Blue Alliance")

    # Criar uma Treeview para exibir os dados
    tree = ttk.Treeview(root, columns=list(df_events.columns), show='headings')

    # Definir as cabeçalhos
    for col in df_events.columns:
        tree.heading(col, text=col)

    # Inserir os dados no Treeview
    for index, row in df_events.iterrows():
        tree.insert('', 'end', values=list(row))

    # Adicionar uma barra de rolagem
    scrollbar = ttk.Scrollbar(root, orient="vertical", command=tree.yview)
    tree.configure(yscroll=scrollbar.set)
    scrollbar.pack(side='right', fill='y')

    # Exibir a Treeview
    tree.pack(expand=True, fill='both')

    # Iniciar a aplicação Tkinter
    root.mainloop()

else:
    print(f"Erro ao obter chaves de eventos: {response.status_code}")
