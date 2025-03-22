import { View, Text } from 'react-native';
import React from 'react';
import Header from './../../components/DocumentDraft/Header';
import Category from './../../components/DocumentDraft/Category';
import Form from './../../components/DocumentDraft/Form';
import Colors from '../../constants/Colors';

export default function DocumentDraft() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.LIGHT_GRAY }}>
      
      {/* Header */}
      <View>
        <Header />
      </View>

      {/* Document category */}
      <View>
        <Category />
      </View>

      {/* Input fields and generate document button */}
      <View style={{ flex: 1 }}>
        <Form />
      </View>
    </View>
  );
}
