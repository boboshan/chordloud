<script lang="ts">
	import { PitchClass, Note, Interval, Chord, PCSet, Key, Progression } from '$lib/index.js';
	import Piano from '$lib/components/Piano.svelte';

	// --- State ---
	let activeTab = $state('playground');
	
	// Playground State
	let selectedNotes = $state<string[]>([]);
	let lastPlayedNote = $state<string | null>(null);

	// Theory State
	let selectedKeyRoot = $state('C');
	let selectedKeyMode = $state<'major' | 'minor'>('major');
	let progressionInput = $state('I IV V I');

	// Tools State
	let intervalStart = $state('C4');
	let intervalEnd = $state('G4');
	let pcsetInput = $state('0 4 7');

	// --- Derived ---

	// Chord Analysis (Playground)
	let chordAnalysis = $derived.by(() => {
		if (selectedNotes.length < 3) return null;
		try {
			const notes = selectedNotes.map(n => Note.from(n));
			// Filter out any PitchClass results (though Piano should only emit Notes)
			const validNotes = notes.filter((n): n is Note => n instanceof Note);
			if (validNotes.length < 3) return null;
			
			const guesses = Chord.guess(validNotes);
			return guesses.length > 0 ? guesses[0] : null;
		} catch (e) {
			return null;
		}
	});

	// Key Info (Theory)
	let keyInfo = $derived.by(() => {
		try {
			return new Key(PitchClass.from(selectedKeyRoot), selectedKeyMode);
		} catch (e) {
			return null;
		}
	});

	// Progression (Theory)
	let progressionResult = $derived.by(() => {
		if (!keyInfo) return null;
		try {
			const romanToDegree: Record<string, number> = {
				'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7,
				'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5, 'vi': 6, 'vii': 7
			};
			
			const degrees = progressionInput.split(/\s+/)
				.filter(Boolean)
				.map(r => romanToDegree[r.replace(/[^a-zA-Z]/g, '')] || 1); // Simple parsing
				
			const chords = Progression.fromDegrees(keyInfo.scale, degrees);
			return chords;
		} catch (e) {
			return null;
		}
	});

	// Interval (Tools)
	let intervalResult = $derived.by(() => {
		try {
			return Interval.between(Note.from(intervalStart), Note.from(intervalEnd));
		} catch (e) {
			return null;
		}
	});

	// PCSet (Tools)
	let pcsetResult = $derived.by(() => {
		try {
			const nums = pcsetInput.split(/\s+/).map(Number).filter(n => !isNaN(n));
			return PCSet.from(nums);
		} catch (e) {
			return null;
		}
	});

	// --- Actions ---
	function handlePianoChange(notes: string[]) {
		selectedNotes = notes;
		if (notes.length > 0) {
			lastPlayedNote = notes[notes.length - 1];
		}
	}

	const TABS = [
		{ id: 'playground', label: '🎹 Playground', icon: '🎹' },
		{ id: 'theory', label: '🎼 Theory & Keys', icon: '🎼' },
		{ id: 'tools', label: '🛠️ Tools', icon: '🛠️' }
	];
</script>

<div class="app-container">
	<header class="main-header">
		<div class="logo">
			<h1>Qord</h1>
			<span class="version">v1.0</span>
		</div>
		<p>Modern Music Theory for TypeScript</p>
	</header>

	<nav class="tabs">
		{#each TABS as tab}
			<button 
				class="tab-btn" 
				class:active={activeTab === tab.id}
				onclick={() => activeTab = tab.id}
			>
				<span class="icon">{tab.icon}</span>
				{tab.label}
			</button>
		{/each}
	</nav>

	<main class="content">
		{#if activeTab === 'playground'}
			<section class="playground-section">
				<div class="piano-container">
					<Piano bind:selected={selectedNotes} />
				</div>

				<div class="analysis-panel">
					<div class="card">
						<h3>Selected Notes</h3>
						<div class="notes-display">
							{#if selectedNotes.length === 0}
								<span class="placeholder">Play notes on the piano...</span>
							{:else}
								{#each selectedNotes as note}
									<span class="note-badge">{note}</span>
								{/each}
							{/if}
						</div>
					</div>

					<div class="card highlight">
						<h3>Chord Recognition</h3>
						{#if chordAnalysis}
							<div class="chord-result">
								<div class="chord-symbol">{chordAnalysis.chord.symbols[0]}</div>
								<div class="chord-name">{chordAnalysis.chord.name}</div>
								<div class="chord-details">
									<span>Root: <strong>{chordAnalysis.chord.root.name}</strong></span>
									<span>Bass: <strong>{chordAnalysis.chord.bass?.name}</strong></span>
									<span>Intervals: <strong>{chordAnalysis.chord.type.intervals.join(' ')}</strong></span>
								</div>
							</div>
						{:else if selectedNotes.length > 0}
							<div class="empty-state">
								Select at least 3 notes to identify a chord
							</div>
						{:else}
							<div class="empty-state">
								Waiting for input...
							</div>
						{/if}
					</div>
				</div>
			</section>

		{:else if activeTab === 'theory'}
			<section class="theory-section">
				<div class="card">
					<h3>Key Explorer</h3>
					<div class="controls">
						<select bind:value={selectedKeyRoot} aria-label="Key Root">
							{#each ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'] as root}
								<option value={root}>{root}</option>
							{/each}
						</select>
						<select bind:value={selectedKeyMode} aria-label="Key Mode">
							<option value="major">Major</option>
							<option value="minor">Minor</option>
						</select>
					</div>

					{#if keyInfo}
						<div class="key-details">
							<div class="detail-row">
								<span>Signature:</span>
								<strong>{keyInfo.signature === 0 ? 'Natural' : (keyInfo.signature > 0 ? `${keyInfo.signature} Sharps` : `${Math.abs(keyInfo.signature)} Flats`)}</strong>
							</div>
							<div class="detail-row">
								<span>Relative:</span>
								<strong>{keyInfo.relative.root.name} {keyInfo.relative.mode}</strong>
							</div>
							<div class="detail-row">
								<span>Parallel:</span>
								<strong>{keyInfo.parallel.root.name} {keyInfo.parallel.mode}</strong>
							</div>
						</div>
					{/if}
				</div>

				<div class="card">
					<h3>Progression Generator</h3>
					<div class="input-group">
						<label for="progression-input">Roman Numerals (e.g., I IV V I)</label>
						<input id="progression-input" type="text" bind:value={progressionInput} placeholder="I IV V I" />
					</div>

					{#if progressionResult}
						<div class="progression-display">
							{#each progressionResult as chord, i}
								<div class="progression-step">
									<span class="degree">{progressionInput.split(' ')[i]}</span>
									<span class="chord">{chord.symbols[0]}</span>
									<div class="notes-small">
										{chord.type.intervals.map(int => PitchClass.fromChroma((chord.root.chroma + int.semitones) % 12).name).join(' ')}
									</div>
								</div>
								{#if i < progressionResult.length - 1}
									<div class="arrow">→</div>
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			</section>

		{:else if activeTab === 'tools'}
			<section class="tools-section">
				<div class="card">
					<h3>Interval Calculator</h3>
					<div class="row">
						<input type="text" bind:value={intervalStart} placeholder="Start (C4)" aria-label="Start Note" />
						<span>to</span>
						<input type="text" bind:value={intervalEnd} placeholder="End (G4)" aria-label="End Note" />
					</div>
					{#if intervalResult}
						<div class="result-box">
							<div class="big-result">{intervalResult.fullName}</div>
							<div class="sub-result">{intervalResult.semitones} semitones ({intervalResult.quality})</div>
						</div>
					{/if}
				</div>

				<div class="card">
					<h3>Pitch Class Set Analysis</h3>
					<input type="text" bind:value={pcsetInput} placeholder="0 4 7" aria-label="Pitch Class Set" />
					{#if pcsetResult}
						<div class="pcset-grid">
							<div class="stat">
								<span>Normal Form</span>
								<span>[{pcsetResult.normal().join(', ')}]</span>
							</div>
							<div class="stat">
								<span>Prime Form</span>
								<span>[{pcsetResult.prime().join(', ')}]</span>
							</div>
							<div class="stat">
								<span>Interval Vector</span>
								<span>&lt;{pcsetResult.intervalVector.join('')}&gt;</span>
							</div>
						</div>
					{/if}
				</div>
			</section>
		{/if}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		background: #f8fafc;
		color: #1e293b;
	}

	.app-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
	}

	.main-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.logo h1 {
		font-size: 3.5rem;
		font-weight: 800;
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		margin: 0;
		display: inline-block;
	}

	.version {
		background: #e2e8f0;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
		vertical-align: top;
		margin-left: 0.5rem;
	}

	.tabs {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.tab-btn {
		padding: 0.75rem 1.5rem;
		border: none;
		background: white;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		color: #64748b;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 1px 2px rgba(0,0,0,0.05);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.tab-btn:hover {
		background: #f1f5f9;
		color: #334155;
	}

	.tab-btn.active {
		background: #3b82f6;
		color: white;
		box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
	}

	.card {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0,0,0,0.1);
		margin-bottom: 1.5rem;
	}

	.card.highlight {
		border: 2px solid #3b82f6;
		background: #eff6ff;
	}

	h3 {
		margin: 0 0 1rem 0;
		color: #475569;
		font-size: 1.1rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Playground Styles */
	.playground-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.piano-container {
		background: #1e293b;
		padding: 2rem;
		border-radius: 16px;
		box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
		overflow-x: auto;
	}

	.analysis-panel {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.notes-display {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		min-height: 3rem;
		align-items: center;
	}

	.note-badge {
		background: #e2e8f0;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-weight: 600;
		color: #334155;
	}

	.chord-result {
		text-align: center;
	}

	.chord-symbol {
		font-size: 3rem;
		font-weight: 800;
		color: #2563eb;
	}

	.chord-name {
		font-size: 1.2rem;
		color: #64748b;
		margin-bottom: 1rem;
	}

	.chord-details {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		font-size: 0.9rem;
		color: #475569;
	}

	/* Theory Styles */
	.theory-section {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	.controls {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	select, input {
		padding: 0.75rem;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		font-size: 1rem;
	}

	.key-details {
		display: grid;
		gap: 0.75rem;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		padding: 0.75rem;
		background: #f8fafc;
		border-radius: 6px;
	}

	.progression-display {
		display: flex;
		align-items: center;
		gap: 1rem;
		overflow-x: auto;
		padding: 1rem 0;
	}

	.progression-step {
		text-align: center;
		background: white;
		padding: 1rem;
		border-radius: 8px;
		border: 1px solid #e2e8f0;
		min-width: 80px;
	}

	.degree {
		display: block;
		font-size: 0.8rem;
		color: #94a3b8;
		margin-bottom: 0.25rem;
	}

	.chord {
		display: block;
		font-size: 1.25rem;
		font-weight: 700;
		color: #3b82f6;
	}

	.notes-small {
		font-size: 0.7rem;
		color: #64748b;
		margin-top: 0.25rem;
	}

	.arrow {
		color: #cbd5e1;
		font-size: 1.5rem;
	}

	/* Tools Styles */
	.tools-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.result-box {
		text-align: center;
		padding: 1.5rem;
		background: #f8fafc;
		border-radius: 8px;
	}

	.big-result {
		font-size: 1.5rem;
		font-weight: 700;
		color: #3b82f6;
	}

	.pcset-grid {
		display: grid;
		gap: 1rem;
		margin-top: 1rem;
	}

	.stat {
		display: flex;
		justify-content: space-between;
		padding: 0.75rem;
		background: #f8fafc;
		border-radius: 6px;
	}

	@media (max-width: 768px) {
		.analysis-panel, .tools-section {
			grid-template-columns: 1fr;
		}
	}
</style>
