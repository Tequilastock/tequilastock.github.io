module.exports = {
  ci: {
    collect: {
      url: [
        'https://tequilastock.github.io/',
        'https://tequilastock.github.io/games/flappy.html',
        'https://tequilastock.github.io/games/snake.html',
        'https://tequilastock.github.io/games/tetris.html'
      ],
      numberOfRuns: 1,
      settings: { preset: 'desktop' }
    },
    upload: { target: 'temporary-public-storage' },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.95}],
        'categories:accessibility': ['error', {minScore: 0.95}],
        'categories:seo': ['error', {minScore: 0.95}],
        'categories:best-practices': ['warn', {minScore: 0.9}]
      }
    }
  }
};
