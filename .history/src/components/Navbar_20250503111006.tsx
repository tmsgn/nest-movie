useEffect(() => {
  if (query.trim()) {
    setLoading(true);
    searchMovies(query)
      .then((data) => {
        if (data && data.length > 0) {
          const fuse = new Fuse(data, fuseOptions);
          const result = fuse.search(normalizeText(query));
          setResults(result.map((item) => item.item)); // Keep the original media_type
        } else {
          setResults([]);
        }
      })
      .catch(() => {
        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  } else {
    setResults([]);
  }
}, [query]);
