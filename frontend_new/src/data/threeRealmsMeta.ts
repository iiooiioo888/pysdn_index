import type { RealmId } from './threeRealmsFeatures'

export type RealmAccent = 'cyan' | 'violet' | 'emerald'

export const REALM_ORDER: readonly RealmId[] = ['tianyu', 'shenyu', 'jingjie'] as const

export const REALM_META: Record<
  RealmId,
  {
    titleKey: string
    subKey: string
    descKey: string
    pointsKey: string
    folderTreeUrl: string
    folderLabelKey: string
    accent: RealmAccent
  }
> = {
  tianyu: {
    titleKey: 'realms_tianyu_title',
    subKey: 'realms_tianyu_sub',
    descKey: 'realms_tianyu_desc',
    pointsKey: 'realms_tianyu_points',
    folderTreeUrl: 'https://github.com/iiooiioo888/pysdn_index/tree/main/frontend_new/content/note-realms/%E5%A4%A9%E5%9F%9F',
    folderLabelKey: 'realms_tianyu_folder',
    accent: 'cyan',
  },
  shenyu: {
    titleKey: 'realms_shenyu_title',
    subKey: 'realms_shenyu_sub',
    descKey: 'realms_shenyu_desc',
    pointsKey: 'realms_shenyu_points',
    folderTreeUrl: 'https://github.com/iiooiioo888/pysdn_index/tree/main/frontend_new/content/note-realms/%E7%A5%9E%E5%9F%9F',
    folderLabelKey: 'realms_shenyu_folder',
    accent: 'violet',
  },
  jingjie: {
    titleKey: 'realms_jingjie_title',
    subKey: 'realms_jingjie_sub',
    descKey: 'realms_jingjie_desc',
    pointsKey: 'realms_jingjie_points',
    folderTreeUrl: 'https://github.com/iiooiioo888/pysdn_index/tree/main/frontend_new/content/note-realms/%E9%8F%A1%E7%95%8C',
    folderLabelKey: 'realms_jingjie_folder',
    accent: 'emerald',
  },
}

export function isRealmId(value: string | undefined): value is RealmId {
  return !!value && REALM_ORDER.includes(value as RealmId)
}
