import React from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { VideoPlayer } from 'expo-video'

// Types for list items
type ListItem = {
  id: string;
};

type TrendingSubmission = ListItem & {
  title: string;
  artist: string;
  image: string;
};

type PopularTicket = ListItem & {
  event: string;
  date: string;
  image: string;
};

type PopularRadioStation = ListItem & {
  name: string;
  logo: string;
};

type FeaturedReel = ListItem & {
  thumbnail: string;
};

type TrendingArtist = ListItem & {
  name: string;
  image: string;
};

type MostEngagedStakeholder = ListItem & {
  username: string;
  avatar: string;
};

type VideoReel = {
  id: string;
  videoUrl: string;
};

type HorizontalListData =
  | TrendingSubmission
  | PopularTicket
  | PopularRadioStation
  | FeaturedReel
  | TrendingArtist
  | MostEngagedStakeholder;

// Props for renderItem function
type RenderItemProps<T> = {
  item: T;
  imageKey: keyof T;
  titleKey: keyof T;
  subtitleKey?: keyof T;
  isRoundCard?: boolean;
};

const HomeScreen: React.FC = () => {
  // Placeholder data for horizontal lists
  const trendingSubmissions: TrendingSubmission[] = [
    { id: "1", title: "Song A", artist: "Artist X", image: "https://source.unsplash.com/100x100/?music,album" },
    { id: "2", title: "Song B", artist: "Artist Y", image: "https://source.unsplash.com/100x100/?concert,stage" },
    { id: "3", title: "Song C", artist: "Artist Z", image: "https://source.unsplash.com/100x100/?guitar,rock" },
    { id: "4", title: "Song D", artist: "Artist W", image: "https://source.unsplash.com/100x100/?microphone,singing" },
    { id: "5", title: "Song E", artist: "Artist V", image: "https://source.unsplash.com/100x100/?headphones,melody" },
    { id: "6", title: "Song F", artist: "Artist U", image: "https://source.unsplash.com/100x100/?music,dj" },
  ];
  
  const popularTickets: PopularTicket[] = [
    { id: "1", event: "Concert A", date: "Oct 25", image: "https://source.unsplash.com/100x100/?festival,lights" },
    { id: "2", event: "Festival B", date: "Nov 10", image: "https://source.unsplash.com/100x100/?crowd,party" },
    { id: "3", event: "Show C", date: "Dec 5", image: "https://source.unsplash.com/100x100/?theater,performance" },
    { id: "4", event: "Concert D", date: "Jan 15", image: "https://source.unsplash.com/100x100/?music,live" },
    { id: "5", event: "Festival E", date: "Feb 20", image: "https://source.unsplash.com/100x100/?dance,club" },
    { id: "6", event: "Show F", date: "Mar 12", image: "https://source.unsplash.com/100x100/?entertainment,show" },
  ];
  
  const popularRadioStations: PopularRadioStation[] = [
    { id: "1", name: "Station X", logo: "https://source.unsplash.com/100x100/?radio,broadcast" },
    { id: "2", name: "Station Y", logo: "https://source.unsplash.com/100x100/?microphone,studio" },
    { id: "3", name: "Station Z", logo: "https://source.unsplash.com/100x100/?headphones,streaming" },
    { id: "4", name: "Station A", logo: "https://source.unsplash.com/100x100/?sound,waves" },
    { id: "5", name: "Station B", logo: "https://source.unsplash.com/100x100/?news,radio" },
    { id: "6", name: "Station C", logo: "https://source.unsplash.com/100x100/?talkshow,media" },
  ];
  
  const featuredReels: FeaturedReel[] = [
    { id: "1", thumbnail: "https://source.unsplash.com/100x100/?video,editor" },
    { id: "2", thumbnail: "https://source.unsplash.com/100x100/?cinema,film" },
    { id: "3", thumbnail: "https://source.unsplash.com/100x100/?camera,production" },
    { id: "4", thumbnail: "https://source.unsplash.com/100x100/?movie,scene" },
    { id: "5", thumbnail: "https://source.unsplash.com/100x100/?vlog,content" },
    { id: "6", thumbnail: "https://source.unsplash.com/100x100/?visuals,creator" },
  ];
  
  const trendingArtists: TrendingArtist[] = [
    { id: "1", name: "Artist A", image: "https://source.unsplash.com/100x100/?singer,performance" },
    { id: "2", name: "Artist B", image: "https://source.unsplash.com/100x100/?musician,guitar" },
    { id: "3", name: "Artist C", image: "https://source.unsplash.com/100x100/?dj,turntable" },
    { id: "4", name: "Artist D", image: "https://source.unsplash.com/100x100/?band,concert" },
    { id: "5", name: "Artist E", image: "https://source.unsplash.com/100x100/?rapper,hiphop" },
    { id: "6", name: "Artist F", image: "https://source.unsplash.com/100x100/?violin,orchestra" },
  ];
  
  const mostEngagedStakeholders: MostEngagedStakeholder[] = [
    { id: "1", username: "User X", avatar: "https://source.unsplash.com/100x100/?business,person" },
    { id: "2", username: "User Y", avatar: "https://source.unsplash.com/100x100/?corporate,meeting" },
    { id: "3", username: "User Z", avatar: "https://source.unsplash.com/100x100/?leader,speech" },
    { id: "4", username: "User W", avatar: "https://source.unsplash.com/100x100/?entrepreneur,success" },
    { id: "5", username: "User V", avatar: "https://source.unsplash.com/100x100/?speaker,conference" },
    { id: "6", username: "User U", avatar: "https://source.unsplash.com/100x100/?networking,team" },
  ];
  
  const videoReels: VideoReel[] = [
    { id: "1", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: "2", videoUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" },
    { id: "3", videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4" },
    { id: "4", videoUrl: "https://www.videvo.net/videvo_files/converted/2015_08/preview/People_Outside_Running_05_Videvo.mov720.mp4" },
    { id: "5", videoUrl: "https://filesamples.com/samples/video/mp4/sample_1280x720.mp4" },
    { id: "6", videoUrl: "https://www.videezy.com/download/46163?download-key=20648a77692b6e9b53e12fd75d1d7a20" },
  ];
  

  // Array of predefined colors
  const colors = ["#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#45677A", "#FAC05E"];

  // Function to get a random color
  const getRandomColor = (): string => colors[Math.floor(Math.random() * colors.length)];

  // Render item for horizontal lists
  const renderItem = <T extends HorizontalListData>({
    item,
    imageKey,
    titleKey,
    subtitleKey,
    isRoundCard,
  }: RenderItemProps<T>) => (
    <TouchableOpacity
      style={[
        isRoundCard ? styles.roundCard : styles.listItem,
        { backgroundColor: getRandomColor() },
      ]}
    >
      <ImageBackground
        source={{ uri: item[imageKey] as string }}
        style={isRoundCard ? styles.roundItemImage : styles.itemImage}
        imageStyle={isRoundCard ? { borderRadius: 50 } : { borderRadius: 8 }}
      >
        {subtitleKey && (
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.8)"]}
            style={styles.itemOverlay}
          >
            <Text style={styles.itemTitle}>{item[titleKey] as string}</Text>
            <Text style={styles.itemSubtitle}>{item[subtitleKey] as string}</Text>
          </LinearGradient>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        }}
        style={styles.heroSection}
        imageStyle={{ borderRadius: 12 }}
      >
        <LinearGradient colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.8)"]} style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Welcome to NORT</Text>
          <Text style={styles.heroSubtitle}>The No. 1 Submission platform in the entire planet</Text>
        </LinearGradient>
      </ImageBackground>

      {/* Horizontal Scrolling Lists */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Trending Submissions</Text>
        <FlatList
          horizontal
          data={trendingSubmissions}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) =>
            renderItem<TrendingSubmission>({
              item,
              imageKey: "image",
              titleKey: "title",
              subtitleKey: "artist",
            })
          }
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Popular Tickets</Text>
        <FlatList
          horizontal
          data={popularTickets}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) =>
            renderItem<PopularTicket>({
              item,
              imageKey: "image",
              titleKey: "event",
              subtitleKey: "date",
            })
          }
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Popular Radio Stations</Text>
        <FlatList
          horizontal
          data={popularRadioStations}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) =>
            renderItem<PopularRadioStation>({
              item,
              imageKey: "logo",
              titleKey: "name",
              isRoundCard: true,
            })
          }
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Featured Reels</Text>
        <FlatList
          horizontal
          data={featuredReels}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.listItem}>
              <ImageBackground
                source={{ uri: item.thumbnail }}
                style={styles.itemImage}
                imageStyle={{ borderRadius: 8 }}
              >
                <View style={styles.playIcon}>
                  <FontAwesome5 name="play" size={20} color="#fff" />
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Trending Artists</Text>
        <FlatList
          horizontal
          data={trendingArtists}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) =>
            renderItem<TrendingArtist>({
              item,
              imageKey: "image",
              titleKey: "name",
              isRoundCard: true,
            })
          }
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Most Engaged Stakeholders</Text>
        <FlatList
          horizontal
          data={mostEngagedStakeholders}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) =>
            renderItem<MostEngagedStakeholder>({
              item,
              imageKey: "avatar",
              titleKey: "username",
              isRoundCard: true,
            })
          }
        />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  heroSection: {
    width: Dimensions.get("window").width - 40,
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#e0e0e0",
    textAlign: "center",
    marginTop: 10,
  },
  listContainer: {
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  listItem: {
    marginRight: 15,
    borderRadius: 8,
    overflow: "hidden",
  },
  roundCard: {
    marginRight: 15,
    alignItems: "center",
    borderRadius: 50,
    overflow: "hidden",
  },
  itemImage: {
    width: 120,
    height: 120,
    justifyContent: "flex-end",
  },
  roundItemImage: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  itemOverlay: {
    padding: 8,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#e0e0e0",
    textAlign: "center",
  },
  playIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
});