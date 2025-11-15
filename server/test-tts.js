/**
 * TTS API Test Script
 * Run this to verify your TTS backend is working correctly
 * 
 * Usage: node test-tts.js
 */

const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5001/api/tts';

// Test 1: Health Check
async function testHealth() {
  console.log('\n🔍 Test 1: Health Check');
  console.log('━'.repeat(50));
  
  try {
    const response = await fetch('http://localhost:5001/api/tts/health');
    const data = await response.json();
    
    if (data.success && data.status === 'healthy') {
      console.log('✅ Health check passed!');
      console.log(`   Status: ${data.status}`);
      console.log(`   Message: ${data.message}`);
      return true;
    } else {
      console.log('❌ Health check failed!');
      console.log('   Response:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    console.log('   Make sure the server is running on port 5001');
    return false;
  }
}

// Test 2: Generate Audio
async function testGenerateAudio() {
  console.log('\n🎵 Test 2: Generate Audio');
  console.log('━'.repeat(50));
  
  try {
    const testText = 'Hello from Mimic! This is a test of the text-to-speech system.';
    console.log(`   Text: "${testText}"`);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: testText,
        options: {
          voiceName: 'en-US-Neural2-C',
          speakingRate: 1.0
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Audio generation failed!');
      console.log('   Error:', errorData.error);
      return false;
    }

    const audioBuffer = await response.arrayBuffer();
    const outputPath = path.join(__dirname, 'test-output.mp3');
    
    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
    
    console.log('✅ Audio generated successfully!');
    console.log(`   File saved: ${outputPath}`);
    console.log(`   Size: ${(audioBuffer.byteLength / 1024).toFixed(2)} KB`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    return true;
  } catch (error) {
    console.log('❌ Audio generation error:', error.message);
    return false;
  }
}

// Test 3: List Voices
async function testListVoices() {
  console.log('\n🎙️  Test 3: List Available Voices');
  console.log('━'.repeat(50));
  
  try {
    const response = await fetch('http://localhost:5001/api/tts/voices?languageCode=en-US');
    const data = await response.json();
    
    if (data.success && data.voices) {
      console.log('✅ Voices retrieved successfully!');
      console.log(`   Language: ${data.languageCode}`);
      console.log(`   Total voices: ${data.voices.length}`);
      console.log('\n   Sample voices:');
      data.voices.slice(0, 5).forEach(voice => {
        console.log(`     • ${voice.name} (${voice.gender})`);
      });
      return true;
    } else {
      console.log('❌ Failed to retrieve voices!');
      return false;
    }
  } catch (error) {
    console.log('❌ Voices list error:', error.message);
    return false;
  }
}

// Test 4: Error Handling
async function testErrorHandling() {
  console.log('\n⚠️  Test 4: Error Handling');
  console.log('━'.repeat(50));
  
  try {
    // Test with missing text
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    
    if (response.status === 400 && data.error) {
      console.log('✅ Error handling works correctly!');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error message: ${data.error}`);
      return true;
    } else {
      console.log('❌ Error handling not working as expected');
      return false;
    }
  } catch (error) {
    console.log('❌ Error handling test failed:', error.message);
    return false;
  }
}

// Test 5: Different Voice Options
async function testVoiceOptions() {
  console.log('\n🎤 Test 5: Voice Options');
  console.log('━'.repeat(50));
  
  const voices = [
    { name: 'Female (Default)', voice: 'en-US-Neural2-C' },
    { name: 'Male (Professional)', voice: 'en-US-Neural2-A' },
  ];

  const testText = 'Testing different voice options.';
  let allPassed = true;

  for (const voiceOption of voices) {
    try {
      console.log(`\n   Testing: ${voiceOption.name} (${voiceOption.voice})`);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: testText,
          options: { voiceName: voiceOption.voice }
        })
      });

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        console.log(`   ✅ Generated: ${(audioBuffer.byteLength / 1024).toFixed(2)} KB`);
      } else {
        console.log(`   ❌ Failed for ${voiceOption.name}`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      allPassed = false;
    }
  }

  return allPassed;
}

// Run all tests
async function runAllTests() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   Text-to-Speech API Test Suite               ║');
  console.log('╚════════════════════════════════════════════════╝');
  
  const results = {
    health: await testHealth(),
    generate: await testGenerateAudio(),
    voices: await testListVoices(),
    errors: await testErrorHandling(),
    voiceOptions: await testVoiceOptions(),
  };

  // Summary
  console.log('\n\n╔════════════════════════════════════════════════╗');
  console.log('║   Test Summary                                 ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, result]) => {
    const icon = result ? '✅' : '❌';
    const status = result ? 'PASSED' : 'FAILED';
    console.log(`   ${icon} ${test.padEnd(15)} : ${status}`);
  });
  
  console.log('\n' + '━'.repeat(50));
  console.log(`   Total: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('\n   🎉 All tests passed! Your TTS API is ready to use.');
    console.log('\n   Next steps:');
    console.log('   1. Check test-output.mp3 file generated');
    console.log('   2. Integrate TTSPlayer component in your React app');
    console.log('   3. See TTS_SETUP_GUIDE.md for usage examples');
  } else {
    console.log('\n   ⚠️  Some tests failed. Please check:');
    console.log('   1. Server is running (node src/index.js)');
    console.log('   2. Google Cloud credentials are configured');
    console.log('   3. GOOGLE_APPLICATION_CREDENTIALS in .env is correct');
    console.log('   4. Text-to-Speech API is enabled in Google Cloud');
  }
  
  console.log('\n' + '═'.repeat(50) + '\n');
}

// Run tests
runAllTests().catch(console.error);
