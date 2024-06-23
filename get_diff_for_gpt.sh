#!/bin/bash

# Get the list of changed files
changed_files=$(git diff --name-only HEAD^)

# Check if there are any changed files
if [ -z "$changed_files" ]; then
  echo "No changed files found."
  exit 0
fi

# Create an array to hold the files to process
files_to_process=()

# Display the changed files and prompt the user to confirm processing
echo "Changed files:"
for file in $changed_files; do
  echo "$file"
  read -p "Do you want to include $file in the processing? (y/n) " choice
  case "$choice" in
    y|Y ) files_to_process+=("$file");;
    * ) echo "Skipping $file";;
  esac
done

# Check if there are any files to process
if [ ${#files_to_process[@]} -eq 0 ]; then
  echo "No files to process."
  exit 0
fi

# Output file
output_file="combined_diff.txt"

# Create or empty the output file
> "$output_file"

# Loop through each file to process
for file in "${files_to_process[@]}"; do
  if [ -f "$file" ]; then
    echo "# Start of $file" >> "$output_file"
    cat "$file" >> "$output_file"
    echo -e "\n# End of $file\n" >> "$output_file"
  fi
done

echo "Combined file created successfully: $output_file"
