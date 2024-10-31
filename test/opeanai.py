
from openai import OpenAI

client = OpenAI(api_key='')

completion = client.chat.completions.create(
    model="gpt-4o",
    stream=True,
    stream_options={
        "include_usage": True
    },
    messages=[
        {"role": "system", "content": ""},
        {
            "role": "user",
            "content": "tell me a joke about dad"
        }
    ]
)

print(f"{completion}")
for chunk in completion:
    print(chunk.usage) 