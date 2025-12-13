import { ApifyClient } from 'apify-client';

export const scrapeJobs = async (req, res) => {
  try {
    const { repoData, city, country, minSalary } = req.body;

    const client = new ApifyClient({
      token: process.env.APIFY_TOKEN,
    });

    // Convert languages array to string
    const searchTerm = repoData.languages.slice(0, 3).join(' ');

    const input = {
      maxResults: 10,
      searchTerm: searchTerm,
      sortBy: "KeywordRelevance",
      country: country,
      suburbOrCity: city,
      salaryMin: minSalary
    };

    const run = await client.actor("websift/seek-job-scraper").call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    res.json({
      success: true,
      jobs: items,
      count: items.length
    });
  } catch (error) {
    console.error('Job scraping error:', error);
    res.status(500).json({ error: error.message });
  }
};