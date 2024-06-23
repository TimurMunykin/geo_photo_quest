#!/bin/bash

# Define the directory to search in
BASE_DIR=$1

# Define the list of excluded files and directories
EXCLUDE_LIST=("node_modules" "concatenated_output.txt" ".git" "gpt_get_all_files.sh" "uploads" "package-lock.json" "public" "dist" ".env" "readme.md" "README.md")

# Function to check if a file or directory is in the exclude list
is_excluded() {
  local path=$1
  for exclude in "${EXCLUDE_LIST[@]}"; do
    if [[ "$path" == *"$exclude"* ]]; then
      return 0
    fi
  done
  return 1
}

# Concatenate all files except those in the exclude list
concat_files() {
  local base_dir=$1
  local output_file=$2

  # Empty the output file
  > "$output_file"

  find "$base_dir" -type f | while read -r file; do
    if ! is_excluded "$file"; then
      echo "===== $file =====" >> "$output_file"
      cat "$file" >> "$output_file"
      echo -e "\n" >> "$output_file"
    fi
  done
}

# Define the output file
OUTPUT_FILE="concatenated_output.txt"

# Call the function to concatenate files
concat_files "$BASE_DIR" "$OUTPUT_FILE"

echo "Concatenation completed. Output file: $OUTPUT_FILE"
