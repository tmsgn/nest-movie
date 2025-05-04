The error `TV details fetch failed.` indicates that the `fetch` call to retrieve TV details from the TMDB API failed. This could be due to several reasons:

1. **Invalid API Key**: Ensure that `NEXT_PUBLIC_TMDB_API_KEY` is correctly set in your environment variables and is valid.
2. **Network Issues**: Check if the server has internet access and can reach the TMDB API.
3. **Incorrect URL**: Verify that the URL being constructed is correct.
4. **Rate Limiting**: TMDB API might be rate-limiting your requests.

### Steps to Debug and Fix:

1. **Log the API Key and URL**:
  Add a `console.log` to check the API key and URL being used:
  ```tsx
  console.log("API Key:", API_KEY);
  console.log("URL:", `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
  ```

2. **Check Environment Variables**:
  Ensure that `NEXT_PUBLIC_TMDB_API_KEY` is defined in your `.env` file and is accessible in your app. Example:
  ```
  NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
  ```
  Restart the development server after updating the `.env` file.

3. **Handle Missing API Key**:
  Add a check to ensure the API key is present:
  ```tsx
  if (!API_KEY) {
    throw new Error("API Key is missing. Please set NEXT_PUBLIC_TMDB_API_KEY.");
  }
  ```

4. **Inspect the Response**:
  Log the response status and body for debugging:
  ```tsx
  const detailsRes = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
  console.log("Details Response Status:", detailsRes.status);
  if (!detailsRes.ok) {
    const errorBody = await detailsRes.text();
    console.error("Details Response Error:", errorBody);
    throw new Error("TV details fetch failed.");
  }
  ```

5. **Test the API Endpoint**:
  Use tools like Postman or curl to test the API endpoint directly with your API key.

6. **Check TMDB API Limits**:
  TMDB has rate limits. If you're making too many requests, you might be temporarily blocked. Check their [API documentation](https://developers.themoviedb.org/3/getting-started/request-rate-limiting).

After applying these steps, you should be able to identify the root cause of the issue.
