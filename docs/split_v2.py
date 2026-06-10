import re
import os

def split_file():
    with open('reconx-dashboard-v2.html', 'r', encoding='utf-8') as f:
        content = f.read()

    os.makedirs('frontend/css', exist_ok=True)
    os.makedirs('frontend/js', exist_ok=True)

    # Extract CSS
    style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    if style_match:
        with open('frontend/css/style.css', 'w', encoding='utf-8') as f:
            f.write(style_match.group(1).strip())

    # Extract JS
    script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
    if script_match:
        js_content = script_match.group(1).strip()
        with open('frontend/js/app.js', 'w', encoding='utf-8') as f:
            f.write(js_content)

    # Extract HTML
    html_content = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="css/style.css" />', content, flags=re.DOTALL)
    html_content = re.sub(r'<script>.*?</script>', '<script src="js/app.js"></script>', html_content, flags=re.DOTALL)
    
    with open('frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(html_content)

if __name__ == '__main__':
    split_file()
