The error "TV show not found" occurs because the `getTvshowDetails` function is returning `null`. This happens when the API call to fetch TV show details does not find any results for the given `title`. Here are some steps to debug and fix the issue:

1. **Check the `params.tvname` value**:
  Ensure that the `params.tvname` is being passed correctly and matches the expected format. For example, if the TV show name is "Breaking Bad", the URL should be `/tv/breaking-bad`.

2. **Verify the slugify and decode logic**:
  The `slugify` function converts the title into a URL-friendly format, and `decodeURIComponent` reverses it. Ensure that the `params.tvname` is being decoded correctly.

3. **Log the API response**:
  Add a `console.log` inside the `getTvshowDetails` function to inspect the API response:
  ```tsx
  const getTvshowDetails = async (title: string): Promise<Tvshow | null> => {
    try {
     const data = await fetchJson(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}`
     );
     console.log("API Response:", data); // Add this line
     const result = data.results?.[0];
     if (!result) return null;

     return {
      id: result.id,
      title: result.title,
      name: result.name,
      poster_path: result.poster_path,
      release_date: result.release_date,
      first_air_date: result.first_air_date,
      vote_average: result.vote_average,
      overview: result.overview ?? "",
      seasons: [],
      origin_country: result.origin_country ?? [],
      genres: [],
     };
    } catch (err) {
     console.error("Error fetching TV show:", err);
     return null;
    }
  };
  ```

4. **Check the API key**:
  Ensure that the `NEXT_PUBLIC_TMDB_API_KEY` environment variable is set correctly and has the necessary permissions to access the TMDB API.

5. **Handle edge cases**:
  If the TV show name contains special characters or spaces, ensure that the `slugify` and `decodeURIComponent` logic handles them properly.

6. **Test with a hardcoded title**:
  Temporarily replace `decodedTitle` with a hardcoded TV show name to verify if the issue is with the API or the input:
  ```tsx
  const decodedTitle = "Breaking Bad"; // Replace with a known TV show name
  ```

After making these changes, test the application again to see if the issue is resolved.
