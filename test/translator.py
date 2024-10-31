import easyocr
from openai import OpenAI
from PIL import Image, ImageDraw, ImageFont
client = OpenAI(api_key='')

def translate_text_with_chatgpt(image_path, target_lang='vi'):
    reader = easyocr.Reader(['en'])
    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)
    font = ImageFont.load_default()

    results = reader.readtext(image_path)

    for bbox, text, prob in results:
        response  = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                    {"role": "system", "content": "Translate the following English text to {target_lang}"},
                    {
                        "role": "user",
                        "content": ":{text}"
                    }
                ]
       
        )
        translation = response.choices[0].message.content

        top_left = tuple(bbox[0]) 
        draw.text(top_left, translation, fill=(255, 0, 0), font=font)

    img.show()
    img.save('translated_image.jpg')

translate_text_with_chatgpt('C:/Users/hamin/Documents/GitHub/Papery/test/LightRAG.png', 'Vietnamese')


