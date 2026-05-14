import { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  ScrollView,
} from "react-native";
import { styles } from "../../App.styles";
import { DetailSection } from "./DetailSection";

export type Photo = {
  id: number | string;
  uri: string;
};

type Props = {
  photos: Photo[];
};

export function PhotoGallery({ photos }: Props) {
  const [viewing, setViewing] = useState<Photo | null>(null);

  return (
    <>
      <DetailSection title="POZE">
        <View style={styles.photoGrid}>
          {photos.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              activeOpacity={0.85}
              style={styles.photoThumbnailWrapper}
              onPress={() => setViewing(photo)}
            >
              <Image
                source={{ uri: photo.uri }}
                style={styles.photoThumbnail}
              />
            </TouchableOpacity>
          ))}
        </View>
      </DetailSection>

      <Modal
        visible={viewing !== null}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setViewing(null)}
      >
        {viewing && (
          <View style={styles.photoModal}>
            <TouchableOpacity
              style={styles.photoCloseBtn}
              onPress={() => setViewing(null)}
              activeOpacity={0.7}
            >
              <Text style={styles.photoCloseBtnText}>×</Text>
            </TouchableOpacity>
            <ScrollView
              style={styles.photoModalScroll}
              contentContainerStyle={styles.photoModalContent}
              maximumZoomScale={3}
              minimumZoomScale={1}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              centerContent
            >
              <Image
                source={{ uri: viewing.uri }}
                style={styles.photoFullImage}
                resizeMode="contain"
              />
            </ScrollView>
          </View>
        )}
      </Modal>
    </>
  );
}
