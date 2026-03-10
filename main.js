import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const questions = [
    // 1: Avoiding
    "When a disagreement arises, I prefer to stay quiet and keep my opinions to myself to avoid the spotlight.",
    // 2: Dominating
    "I strongly push to get my own way, even if it means stepping on a few toes.",
    // 3: Compromising
    "I suggest meeting halfway so that we can wrap up the conflict quickly and move on.",
    // 4: Obliging
    "I often set aside my own goals to make sure the other person gets what they want.",
    // 5: Integrating
    "I dig deep into the root cause of the problem to find a creative solution that fully satisfies us both.",
    
    // 6: Avoiding
    "I actively steer conversations away from topics that I know might cause an argument.",
    // 7: Dominating
    "I rely on my authority, rank, or leverage to make sure the final decision goes my way.",
    // 8: Compromising
    "When we are deadlocked, I look for a quick trade-off where we each give up a little bit.",
    // 9: Obliging
    "I go along with the other person's ideas, even if I secretly disagree with them.",
    // 10: Integrating
    "I actively combine my ideas with the other person's thoughts to build a completely new, shared plan.",
    
    // 11: Avoiding
    "I will physically or emotionally distance myself from a situation if tension starts to build.",
    // 12: Dominating
    "I use my specialized knowledge or experience to outmaneuver others and win the argument.",
    // 13: Compromising
    "I believe fair is fair, so I try to find a solution where we both get exactly half of what we want.",
    // 14: Obliging
    "I'd rather just give in and agree than expend the energy to keep fighting over something.",
    // 15: Integrating
    "I refuse to settle until we have brainstormed an outcome where neither of us feels like we sacrificed anything.",
    
    // 16: Avoiding
    "I bite my tongue when someone does something that upsets me so I don't hurt their feelings.",
    // 17: Dominating
    "Once I've made up my mind on an issue, I am determined to convince the other person I am right.",
    // 18: Compromising
    "I am willing to sacrifice some of my demands if the other person is willing to do the same.",
    // 19: Obliging
    "I find myself yielding to the other person's suggestions just to maintain harmony in the relationship.",
    // 20: Integrating
    "I share all my underlying concerns honestly and encourage them to do the same so we can tackle the issue as a team.",
    
    // 21: Avoiding
    "I put off having difficult conversations for as long as possible.",
    // 22: Dominating
    "I treat disagreements like a game or a battle where my primary goal is to come out on top.",
    // 23: Compromising
    "I actively try to strike a bargain, focusing on 'give and take' rather than getting everything perfect.",
    // 24: Obliging
    "I prioritize keeping the peace, so I bend over backwards to meet the other person's expectations.",
    // 25: Integrating
    "I bring all hidden issues out into the open, no matter how uncomfortable, so we can address everything thoroughly."
  ];

const descriptions = {
  Avoiding: "Sidestepping conflict. Useful for trivial issues, but can lead to unresolved tension.",
  Dominating: "Firm and assertive. Highly effective in crises or when standing up for boundaries, but can strain teamwork.",
  Compromising: "Seeking the middle ground. Values fairness and expediency, requiring both sides to give something up.",
  Obliging: "Putting others first. Builds social capital and harmony, but risks leaving your own needs unmet.",
  Integrating: "Collaborating for win-win solutions. Takes time and trust, but results in the strongest resolutions."
};

export default function App() {
  const [screen, setScreen] = useState('home'); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [pastResult, setPastResult] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);

  useEffect(() => {
    loadPastResult();
  }, []);

  const loadPastResult = async () => {
    try {
      const saved = await AsyncStorage.getItem('@conflict_scores');
      if (saved !== null) {
        setPastResult(JSON.parse(saved));
      }
    } catch (e) {
      console.log("Failed to load data.");
    }
  };

  const saveResult = async (resultToSave) => {
    try {
      await AsyncStorage.setItem('@conflict_scores', JSON.stringify(resultToSave));
      setPastResult(resultToSave);
    } catch (e) {
      console.log("Failed to save data.");
    }
  };

  const handleSelect = (value) => {
    const newAnswers = [...answers, value];
    if (currentIdx < 24) {
      setAnswers(newAnswers);
      setCurrentIdx(currentIdx + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = (finalAnswers) => {
    let scores = { Avoiding: 0, Dominating: 0, Compromising: 0, Obliging: 0, Integrating: 0 };
    finalAnswers.forEach((val, i) => {
      let qNum = i + 1;
      if ([1, 6, 11, 16, 21].includes(qNum)) scores.Avoiding += val;
      else if ([2, 7, 12, 17, 22].includes(qNum)) scores.Dominating += val;
      else if ([3, 8, 13, 18, 23].includes(qNum)) scores.Compromising += val;
      else if ([4, 9, 14, 19, 24].includes(qNum)) scores.Obliging += val;
      else if ([5, 10, 15, 20, 25].includes(qNum)) scores.Integrating += val;
    });

    const maxScore = Math.max(...Object.values(scores));
    const primaries = Object.keys(scores).filter(k => scores[k] === maxScore);
    const secondaries = Object.keys(scores).filter(k => scores[k] >= maxScore - 3 && scores[k] < maxScore);

    const resultObj = { scores, primaries, secondaries, date: new Date().toLocaleDateString() };
    
    setCurrentResult(resultObj);
    saveResult(resultObj);
    setScreen('results');
  };

  const openLearnMore = (style) => {
    const url = `https://www.google.com/search?q=Thomas+Kilmann+${style}+Conflict+Management+Style`;
    Linking.openURL(url);
  };

  const reset = () => {
    setAnswers([]);
    setCurrentIdx(0);
    setCurrentResult(null);
    setScreen('home');
  };

  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Conflict Style Assessment</Text>
          <Text style={styles.subtitle}>Discover how you naturally navigate disagreements and collaboration.</Text>
          
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => setScreen('quiz')}>
            <Text style={styles.btnText}>Start New Assessment</Text>
          </TouchableOpacity>

          {pastResult && (
            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => {
              setCurrentResult(pastResult);
              setScreen('results');
            }}>
              <Text style={styles.btnText}>View Past Results ({pastResult.date})</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'results' && currentResult) {
    const { scores, primaries, secondaries } = currentResult;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Assessment Results</Text>
          
          <View style={styles.primaryCard}>
            <Text style={styles.primaryTitle}>
              Primary Style{primaries.length > 1 ? 's' : ''}: {primaries.join(' & ')}
            </Text>
            
            {primaries.length > 1 ? (
              <View>
                <Text style={styles.primaryDesc}>
                  You tied for multiple dominant styles. This indicates high adaptability. You likely shift your approach depending on the specific conflict, the stakes involved, or how much energy you have at the moment.
                </Text>
                {primaries.map(p => (
                  <Text key={p} style={styles.bulletItem}>• {p}: {descriptions[p]}</Text>
                ))}
              </View>
            ) : (
              <Text style={styles.primaryDesc}>{descriptions[primaries[0]]}</Text>
            )}

            {primaries.map(p => (
               <TouchableOpacity key={`link-${p}`} style={styles.linkButton} onPress={() => openLearnMore(p)}>
                 <Text style={styles.linkButtonText}>Learn about {p} →</Text>
               </TouchableOpacity>
            ))}
          </View>

          {secondaries.length > 0 && (
            <View style={styles.secondaryCard}>
              <Text style={styles.secondaryTitle}>Close Fallbacks: {secondaries.join(', ')}</Text>
              <Text style={styles.secondaryDesc}>
                Scoring within 3 points of your dominant style means these are strong secondary strategies. You likely pivot to these naturally when your primary approach hits a wall or when dealing with specific types of people.
              </Text>
              {secondaries.map(s => (
                <Text key={s} style={styles.bulletItemSecondary}>• {s}: {descriptions[s]}</Text>
              ))}
            </View>
          )}
          
          <View style={styles.scoreBoard}>
            {Object.keys(scores).map((key) => (
              <View key={key} style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>{key}</Text>
                <Text style={styles.scoreValue}>{scores[key]} / 25</Text>
              </View>
            ))}
          </View>

          

          <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={reset}>
            <Text style={styles.btnTextOutline}>Return to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const progressWidth = `${((currentIdx) / 25) * 100}%`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: progressWidth }]} />
        </View>

        <Text style={styles.legendText}>1: Never | 2: Seldom | 3: Sometimes | 4: Often | 5: Always</Text>
        <Text style={styles.progressText}>Question {currentIdx + 1} of 25</Text>
        
        <View style={styles.questionCard}>
          <Text style={styles.question}>{questions[currentIdx]}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity key={num} style={styles.circle} onPress={() => handleSelect(num)}>
              <Text style={styles.circleText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  innerContainer: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f8fafc', marginBottom: 10, marginTop: 40, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#94a3b8', textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 },
  btn: { width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  btnPrimary: { backgroundColor: '#6366f1' },
  btnSecondary: { backgroundColor: '#334155' },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#334155', marginTop: 10 },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  btnTextOutline: { color: '#f8fafc', fontSize: 18, fontWeight: 'bold' },
  progressBarContainer: { width: '100%', height: 8, backgroundColor: '#334155', borderRadius: 4, marginBottom: 20, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#6366f1' },
  legendText: { color: '#94a3b8', fontSize: 12, marginBottom: 30, backgroundColor: '#1e293b', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  progressText: { color: '#6366f1', fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  questionCard: { backgroundColor: '#1e293b', padding: 30, borderRadius: 15, width: '100%', minHeight: 150, justifyContent: 'center', marginBottom: 40, borderWidth: 1, borderColor: '#334155' },
  question: { color: '#f8fafc', fontSize: 20, textAlign: 'center', lineHeight: 28 },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 },
  circle: { width: 55, height: 55, borderRadius: 27.5, borderWidth: 2, borderColor: '#475569', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' },
  circleText: { color: '#f8fafc', fontWeight: 'bold', fontSize: 18 },
  primaryCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 15, width: '100%', marginBottom: 15, borderWidth: 1, borderColor: '#6366f1' },
  primaryTitle: { color: '#f8fafc', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  primaryDesc: { color: '#cbd5e1', fontSize: 16, lineHeight: 24, marginBottom: 15 },
  bulletItem: { color: '#e0e7ff', fontSize: 15, lineHeight: 22, marginBottom: 8, paddingLeft: 10 },
  linkButton: { backgroundColor: '#4f46e5', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  linkButtonText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  secondaryCard: { backgroundColor: '#0f172a', padding: 20, borderRadius: 15, width: '100%', marginBottom: 20, borderWidth: 1, borderColor: '#475569' },
  secondaryTitle: { color: '#f8fafc', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  secondaryDesc: { color: '#94a3b8', fontSize: 15, lineHeight: 22, marginBottom: 15 },
  bulletItemSecondary: { color: '#cbd5e1', fontSize: 14, lineHeight: 20, marginBottom: 6, paddingLeft: 10 },
  scoreBoard: { width: '100%', backgroundColor: '#1e293b', borderRadius: 15, padding: 20, marginBottom: 20 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  scoreLabel: { color: '#f8fafc', fontSize: 16, fontWeight: '500' },
  scoreValue: { color: '#94a3b8', fontSize: 16, fontWeight: 'bold' }
});