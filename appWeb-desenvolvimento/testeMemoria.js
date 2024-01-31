const v8 = require('v8');

const stats = v8.getHeapStatistics();

console.log('Estatísticas de uso de memória:', stats);

console.log('Limite atual de memória:', stats.heap_size_limit);

const bytesToGB = (bytes) => bytes / (1024 ** 3);

console.log('Total Available Size (GB):', bytesToGB(stats.total_available_size));
console.log('Total Heap Size (GB):', bytesToGB(stats.total_heap_size));

console.log('Total Available Size (GB):', bytesToGB(stats.total_available_size));
console.log('Total Heap Size (GB):', bytesToGB(stats.total_heap_size));
console.log('Used Heap Size (GB):', bytesToGB(stats.used_heap_size));
console.log('Heap Size Limit (GB):', bytesToGB(stats.heap_size_limit));
