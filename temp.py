import json
import yt_dlp

URL = 'https://www.youtube.com/watch?v=YJGf89FPQrc'

ydl_opts = {}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    # 1. Fetch the metadata (dictionary)
    info = ydl.extract_info(URL, download=False)

    # 2. Sanitize the info (removes private keys and ensures safety)
    clean_info = ydl.sanitize_info(info)

    # 3. Open a file and dump the JSON into it
    with open('video_data.json', 'w', encoding='utf-8') as f:
        json.dump(clean_info, f, indent=4, ensure_ascii=False)

print("Done! Check video_data.json")