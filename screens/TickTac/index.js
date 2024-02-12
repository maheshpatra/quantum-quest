// GameBoard.js
import React, { useState, useEffect,useCallback  } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert,ImageBackground,Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
const ts=Dimensions.get('screen').width/100
const TickTac = ({ navigation }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
   const [fontsLoaded, fontError] = useFonts({
    'Inter-Black': require('../../assets/abc.ttf'),
  });

  
  useEffect(() => {
    checkWinner();
    if (player === 'O' && !winner) {
      makeComputerMove();
    }
  }, [board]);
   const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);



  const checkWinner = () => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        Alert.alert(`${board[a]} wins!`, 'Game Over', [{ text: 'OK', onPress: resetGame }]);
      }
    }

    if (!board.includes(null) && !winner) {
      setWinner('Draw');
      Alert.alert('Draw!', 'Game Over', [{ text: 'OK', onPress: resetGame }]);
    }
  };

  const makeMove = (index) => {
    if (!board[index] && !winner) {
      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);
      setPlayer(player === 'X' ? 'O' : 'X');
    }
  };

 

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setPlayer('X');
    setWinner(null);
  };

 const evaluate = () => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === 'X' ? -1 : 1;
      }
    }

    if (!board.includes(null)) {
      return 0; // Draw
    }

    return null; // Game still in progress
  };

  const minimax = (depth, isMaximizing) => {
    const score = evaluate();

    if (score !== null) {
      return score;
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          const eeval = minimax(depth + 1, false);
          board[i] = null;
          maxEval = Math.max(maxEval, eeval);
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          const weval = minimax(depth + 1, true);
          board[i] = null;
          minEval = Math.min(minEval, weval);
        }
      }
      return minEval;
    }
  };

  const findBestMove = () => {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = minimax(0, false);
        board[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const makeComputerMove = () => {
    const bestMove = findBestMove();
    makeMove(bestMove);
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
    <ImageBackground source={require('../../assets/back.png')} resizeMode="" style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <Text style={{fontFamily:'Inter-Black',fontSize: 24,
    marginBottom: 20,color:'#7D410F'}}>Tic Tac Toe</Text>
      <View style={styles.board}>
        {board.map((square, index) => (
          <TouchableOpacity
            key={index}
            style={styles.square}
            onPress={() => makeMove(index)}
            disabled={square !== null || winner !== null}
          >
            <Text style={styles.squareText}>{square}</Text>
          </TouchableOpacity>
        ))}
      </View>
      </ImageBackground>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    
  },
 
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#A25615',
    width:'98%',
    padding:12,
    borderRadius:20
  },
  square: {
    width: ts*30,
    height: ts*30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor:'#A25615'
  },
  squareText: {
    fontSize: 29,

    fontWeight:'bold',
    color:'#fff'
  },
});

export default TickTac;
