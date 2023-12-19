import os
import sys

def rename_images(folder_path):
    # Check if the folder exists
    if not os.path.exists(folder_path):
        print(f"The folder {folder_path} does not exist.")
        return

    # Get all .png files in the folder
    png_files = [f for f in os.listdir(folder_path) if f.endswith('.jpeg')]

    # Sort the files to maintain any existing order
    png_files.sort()

    # Rename each file
    for i, filename in enumerate(png_files, start=36):
        new_name = f"image{i}.png"
        old_file = os.path.join(folder_path, filename)
        new_file = os.path.join(folder_path, new_name)

        os.rename(old_file, new_file)
        print(f"Renamed '{filename}' to '{new_name}'")

# Getting the folder path from the command line arguments
if len(sys.argv) != 2:
    print("Usage: python script.py <path_to_folder>")
else:
    folder_path = sys.argv[1]
    rename_images(folder_path)
