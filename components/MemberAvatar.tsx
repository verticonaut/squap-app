import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import type { Member } from '../types/member';

interface MemberAvatarProps {
  member: Member;
  size?: number;
}

export function MemberAvatar({ member, size = 40 }: MemberAvatarProps) {
  const imageSource = member.gender_code.toLowerCase() === 'female'
    ? require('@/assets/images/girl-bw.png')
    : require('@/assets/images/boy-bw.png');

  return (
    <Image
      source={imageSource}
      style={[styles.avatar, { width: size, height: size }]}
      contentFit="cover"
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 20,
  },
});