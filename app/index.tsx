import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { colors } from "@/constants/colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAll } from "@/features/videogames/api";
import GameListCards from "@/features/videogames/GameListCards";
import GameDetailsCard from "@/features/videogames/details/GameDetailsCard";
import AppHeader from "@/features/header/AppHeader";

export default function Index() {
}