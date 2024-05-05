import csv
import json

def extract_movie_data(csv_file):
    movies = []
    with open(csv_file, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            title = row['Film Title']
            audience_score = int(row['Audience Score Aggregate']) if row['Audience Score Aggregate'] else 0
            critic_score = int(row['Critical Score Aggregate']) if row['Critical Score Aggregate'] else 0
            movie = {
                'title': title,
                'audience_score': audience_score,
                'critic_score': critic_score
            }
            movies.append(movie)
    return movies
def generate_js_code(movies):
    js_code = 'let movies = ' + json.dumps(movies, indent=4) + ';'
    return js_code

def save_to_js_file(js_code, output_file):
    with open(output_file, 'w') as jsfile:
        jsfile.write(js_code)

def main():
    csv_file = 'Oscarbait.csv'  # Replace with the path to your CSV file
    output_file = 'movies_data.js'  # Output JavaScript file
    movies = extract_movie_data(csv_file)
    js_code = generate_js_code(movies)
    save_to_js_file(js_code, output_file)
    print("JavaScript code generated and saved to", output_file)

if __name__ == "__main__":
    main()
