// Simple Memory Cassette - Clean Version
class MemoryCassette {
    constructor() {
        this.thoughtInput = document.getElementById('thoughtInput');
        this.dumpBtn = document.getElementById('dumpBtn');
        this.testBtn = document.getElementById('testBtn');
        this.archiveToggle = document.getElementById('archiveToggle');
        this.trackName = document.getElementById('trackName');
        
        this.archiveMode = false;
        this.archive = new MemoryArchive();
        
        this.init();
    }
    
    init() {
        console.log('Simple MemoryCassette initialized');
        this.bindEvents();
    }
    
    bindEvents() {
        console.log('Binding events...');
        
        if (this.dumpBtn) {
            console.log('Dump button found, adding listener');
            this.dumpBtn.addEventListener('click', () => {
                console.log('Dump button clicked!');
                this.handleDump();
            });
        }
        
        if (this.testBtn) {
            console.log('Test button found, adding listener');
            this.testBtn.addEventListener('click', () => {
                console.log('Test button clicked!');
                this.testArchive();
            });
        }
        
        if (this.archiveToggle) {
            console.log('Archive toggle found, adding listener');
            this.archiveToggle.addEventListener('click', () => {
                console.log('Archive toggle clicked!');
                this.toggleArchive();
            });
        }
    }
    
    handleDump() {
        const text = this.thoughtInput.value.trim();
        console.log('Dump called with text:', text);
        console.log('Archive mode:', this.archiveMode);
        
        if (!text) {
            alert('Please type something first!');
            return;
        }
        
        if (this.archiveMode) {
            console.log('Saving to archive...');
            const memory = this.archive.createMemory(text);
            const saved = this.archive.saveMemory(memory);
            console.log('Save result:', saved);
            const stats = this.archive.getStats();
            alert(`Memory saved: ${saved}\nContent: "${text}"\nTotal memories: ${stats.totalMemories}`);
        } else {
            console.log('Temporary mode - not saving');
            alert(`Memory processed (temporary): "${text}"\n\nTip: Click the corner toggle (🗑️) to enable archive mode and save memories!`);
        }
        
        this.thoughtInput.value = '';
        this.trackName.textContent = 'Processed';
        setTimeout(() => {
            this.trackName.textContent = 'Ready';
        }, 2000);
    }
    
    testArchive() {
        const stats = this.archive.getStats();
        const memories = this.archive.getAllMemories();
        
        console.log('Current memories:', memories);
        
        let message = `Archive Status:\nTotal memories: ${stats.totalMemories}\n\n`;
        
        if (memories.length > 0) {
            message += 'Recent memories:\n';
            memories.slice(0, 3).forEach((memory, index) => {
                message += `${index + 1}. ${memory.preview} (${memory.dateCreated})\n`;
            });
        } else {
            message += 'No memories stored yet.\n\nTip: Turn on archive mode (click corner toggle) then dump a memory!';
        }
        
        alert(message);
    }
    
    toggleArchive() {
        this.archiveMode = !this.archiveMode;
        const icon = this.archiveToggle.querySelector('.toggle-icon');
        
        if (this.archiveMode) {
            this.archiveToggle.style.background = '#4CAF50';
            icon.textContent = '💾';
            alert('Archive mode ON - memories will be saved');
        } else {
            this.archiveToggle.style.background = '';
            icon.textContent = '🗑️';
            alert('Temporary mode - memories will be cleared');
        }
    }
}

// Simple Memory Archive
class MemoryArchive {
    constructor() {
        this.storageKey = 'memory-cassette-simple';
    }
    
    createMemory(content) {
        return {
            id: Date.now().toString(),
            content: content,
            timestamp: new Date().toISOString(),
            dateCreated: new Date().toLocaleDateString(),
            preview: content.length > 50 ? content.substring(0, 50) + '...' : content
        };
    }
    
    saveMemory(memory) {
        try {
            const memories = this.getAllMemories();
            memories.unshift(memory);
            localStorage.setItem(this.storageKey, JSON.stringify(memories));
            return true;
        } catch (error) {
            console.error('Save error:', error);
            return false;
        }
    }
    
    getAllMemories() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Load error:', error);
            return [];
        }
    }
    
    getStats() {
        const memories = this.getAllMemories();
        return {
            totalMemories: memories.length
        };
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting simple version...');
    try {
        new MemoryCassette();
        console.log('Simple version initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
});