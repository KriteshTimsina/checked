// import * as Print from 'expo-print';

// import { ThemedView } from '@/components/ThemedView';
// import { Colors } from '@/constants/Colors';
// import { useEntries } from '@/store/entries';
// import { generateChecklistHTML } from '@/utils/htmlTempelates';
// import { Ionicons } from '@expo/vector-icons';
// import AntDesign from '@expo/vector-icons/AntDesign';
// import { isAvailableAsync, shareAsync } from 'expo-sharing';
// import React, { useCallback, useState } from 'react';
// import { Modal, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
// import { ThemedText } from './ThemedText';
// import { debounce } from 'lodash';
// import { useProject } from '@/store/projects';
// import { haptics } from '@/utils/haptics';
// import { toast } from '@/utils/toast';
// import { useRouter } from 'expo-router';

// interface MenuProps {
//   title: string;
//   projectId: number;
// }

// export function ChecklistMenu({ title, projectId }: MenuProps) {
//   const [menuVisible, setMenuVisible] = useState(false);
//   const { entries } = useEntries();
//   const { deleteProject } = useProject();
//   const router = useRouter();

//   const printToFile = async () => {
//     const isSharingAvailable = await isAvailableAsync();

//     if (isSharingAvailable) {
//       const html = generateChecklistHTML(title, entries);
//       const { uri } = await Print.printToFileAsync({ html });
//       closeMenu();
//       await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
//     }
//   };

//   const deleteChecklist = async () => {
//     try {
//       const deleted = await deleteProject(projectId);

//       if (deleted) {
//         haptics.success();
//         router.back();
//         return toast('Project deleted successfully.');
//       }
//     } catch (error) {
//       haptics.error();
//       toast('Failed deleting project');
//       console.error(error);
//     }
//   };

//   const openMenu = useCallback(
//     //debounced openMenu because it is called on onPressIn instead of onPress
//     debounce(() => setMenuVisible(true), 100),
//     [],
//   );
//   const closeMenu = () => setMenuVisible(false);

//   return (
//     <>
//       <TouchableOpacity hitSlop={8} onPressIn={openMenu} style={styles.menuButton}>
//         <Ionicons name="ellipsis-vertical" size={24} color={Colors.dark.icon} />
//       </TouchableOpacity>

//       <Modal
//         visible={menuVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={closeMenu}
//       >
//         <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
//           <ThemedView style={styles.menuContent}>
//             <Pressable style={styles.menuItem} onPress={printToFile}>
//               <AntDesign name="pdffile1" size={20} style={styles.menuIcon} />
//               <ThemedText style={styles.menuText}>Share as PDF</ThemedText>
//             </Pressable>
//             <Pressable style={styles.menuItem} onPress={deleteChecklist}>
//               <Ionicons name="trash-outline" size={20} color={'red'} />
//               <ThemedText style={styles.menuText}>Delete checklist</ThemedText>
//             </Pressable>
//           </ThemedView>
//         </Pressable>
//       </Modal>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   menuButton: {
//     marginRight: 8,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-start',
//   },
//   menuContent: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     borderRadius: 8,
//     padding: 4,
//     minWidth: 200,
//     shadowColor: '#71717B',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     backgroundColor: Colors.dark.background,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 4,
//     gap: 8,
//   },
//   menuIcon: {
//     color: Colors.dark.tabIconDefault,
//   },
//   menuText: {
//     color: Colors.dark.tabIconDefault,
//   },
//   deleteText: {
//     color: 'red',
//   },
//   alertContent: {
//     margin: 20,
//     backgroundColor: Colors.dark.background,
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   spacer: {
//     height: 8,
//   },
//   printer: {
//     textAlign: 'center',
//   },
// });
