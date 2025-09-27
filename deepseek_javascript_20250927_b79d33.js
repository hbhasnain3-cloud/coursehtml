// backend/src/services/searchService.js
const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({ node: process.env.ELASTICSEARCH_URL });

class SearchService {
  async indexCourse(course) {
    await esClient.index({
      index: 'courses',
      id: course.id,
      body: {
        title: course.title,
        description: course.description,
        category: course.category,
        instructor: course.instructor_name,
        level: course.level,
        language: course.language,
        rating: course.average_rating,
        students: course.total_students,
        created_at: course.created_at
      }
    });
  }

  async searchCourses(query, filters = {}, page = 1, limit = 20) {
    const from = (page - 1) * limit;
    
    const searchQuery = {
      bool: {
        must: [],
        filter: []
      }
    };

    if (query) {
      searchQuery.bool.must.push({
        multi_match: {
          query: query,
          fields: ['title^3', 'description^2', 'instructor'],
          fuzziness: 'AUTO'
        }
      });
    }

    // Add filters
    if (filters.category) {
      searchQuery.bool.filter.push({ term: { 'category.keyword': filters.category } });
    }
    if (filters.level) {
      searchQuery.bool.filter.push({ term: { 'level.keyword': filters.level } });
    }

    const result = await esClient.search({
      index: 'courses',
      body: {
        query: searchQuery,
        sort: [
          { _score: { order: 'desc' } },
          { students: { order: 'desc' } }
        ],
        from: from,
        size: limit
      }
    });

    return {
      courses: result.hits.hits.map(hit => hit._source),
      total: result.hits.total.value
    };
  }
}

module.exports = new SearchService();