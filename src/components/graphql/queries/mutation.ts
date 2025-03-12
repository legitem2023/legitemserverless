import { gql } from "@apollo/client"

export const DELETE_CHILD_INVENTORY = gql`
mutation DeleteChildInventory($deleteChildInventoryId: Int) {
  deleteChildInventory(id: $deleteChildInventoryId) {
    statusText
  }
}`
