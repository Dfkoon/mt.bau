import os
import shutil

dir_path = 'public/assets/avatars'
files = [f for f in os.listdir(dir_path) if f.endswith('.png')]
files.sort() # Sort by name

mapping = {
    0: 'flork_female_grad.png',
    1: 'flork_female_cool.png',
    2: 'flork_cool.png',
    3: 'flork_crying.png',
    4: 'flork_cool_v2.png',
    5: 'flork_heart.png'
}

for i, filename in enumerate(files):
    if i in mapping:
        old_path = os.path.join(dir_path, filename)
        new_path = os.path.join(dir_path, mapping[i])
        print(f"Renaming {filename} to {mapping[i]}")
        os.rename(old_path, new_path)
