import { MaybeRef } from '@vueuse/core'

import { computed, ComputedRef, ref, unref, UnwrapRef, watch } from 'vue-demi'
export type SelectedArray = MaybeRef<{ [key: string]: any }[]>

export interface SelectedMultipleOptions {
  /**
   * 选择字段
   *
   * @default 'select'
   */
  fieldName?: string
  /**
   * 是否必选
   * @default false
   *
   */
  required?: boolean
}

export interface SelectedMultipleResult<T extends SelectedArray> {
  /**
   * 当前选中项
   */
  selectItem: ComputedRef<UnwrapRef<T>[number] | undefined>
}

export const useSelectedSingle = <T extends SelectedArray>(
  array: T,
  options: SelectedMultipleOptions = {}
): SelectedMultipleResult<T> => {
  const fieldName = options.fieldName ?? 'select'
  const required = options.required ?? false

  const SELECTED_SINGLE_KEY = 'selected_single_key'

  const isLock = ref(false)

  /** 当前是否已经选择 */
  const isSelect = computed(() => !!unref(array).some((item) => item.select))

  if (required) {
    watch(
      isSelect,
      (bool) => {
        const index = required === true ? 0 : required
        if (!bool && unref(array).length > 0) {
          unref(array)[index][fieldName] = true
        }
      },
      { flush: 'sync', immediate: true }
    )
  }

  const resetAllSelected = (neglect: number) => {
    if (isLock.value) return
    isLock.value = true

    const _array = unref(array)
    const _value = !_array[neglect][fieldName]

    if (required && !_value) {
      _array[neglect][fieldName] = true
    }

    _array.forEach((target, index) => {
      if (neglect === index) return undefined
      if (!target[fieldName]) return undefined
      target[fieldName] = false
    })

    isLock.value = false
  }

  const watchTargetEffect = (target: { [key: string]: any }, index: number) => {
    if (!target[SELECTED_SINGLE_KEY]) {
      watch(
        () => target[fieldName],
        () => resetAllSelected(index),
        { flush: 'sync' }
      )
      return undefined
    }
    Object.defineProperty(target, SELECTED_SINGLE_KEY, { value: true })
  }

  watch(
    array,
    () => {
      unref(array).forEach(watchTargetEffect)
    },
    { immediate: true, flush: 'sync' }
  )

  /** 当前选中的项 */
  const selectItem = computed(() => unref(array).find((v) => v[fieldName]))

  return { selectItem }
}
