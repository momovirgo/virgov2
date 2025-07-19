const fs = require('fs');
const path = require('path');

const statsPath = path.join(__dirname, 'data', 'stats.json');

class StatsManager {
  constructor() {
    this.stats = {};
    this.load();
  }

  load() {
    try {
      const data = fs.readFileSync(statsPath, 'utf8');
      this.stats = JSON.parse(data);
    } catch (error) {
      console.error('Error cargando stats.json:', error);
      this.stats = {};
    }
  }

  save() {
    try {
      fs.writeFileSync(statsPath, JSON.stringify(this.stats, null, 2));
    } catch (error) {
      console.error('Error guardando stats.json:', error);
    }
  }

  getStats(nombre) {
    return this.stats[nombre.toLowerCase()] || null;
  }

  getAllStats() {
    return this.stats;
  }

  setStats(nombre, data) {
    this.stats[nombre.toLowerCase()] = data;
    this.save();
  }

  playerExists(nombre) {
    return !!this.stats[nombre.toLowerCase()];
  }
}

module.exports = new StatsManager();
