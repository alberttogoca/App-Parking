import React from 'react'
import { Text, View, TouchableWithoutFeedback } from 'react-native'

import { Ionicons } from '@expo/vector-icons';


import * as theme from '../themes/theme';
import { styles } from '../themes/styles';

function Header(){
  return (
    <View style={styles.header}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.headerTitle}>Detected location</Text>
        <Text style={styles.headerLocation}>Helsinki, FI</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', }}>
        <TouchableWithoutFeedback>
          <Ionicons name="ios-menu" size={theme.SIZES.icon * 1.5} />
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}
 
export default Header;