import { gql } from "@apollo/client"

export const DELETE_CHILD_INVENTORY = gql`
mutation DeleteChildInventory($deleteChildInventoryId: Int) {
  deleteChildInventory(id: $deleteChildInventoryId) {
    statusText
  }
}`

export const UPDATE_PARENT_INVENTORY = gql`
mutation Mutation($productId: Int, $category: String, $productType: String, $brandname: String, $productName: String, $status: String) {
  updateParentInventory(productID: $productId, category: $category, productType: $productType, brandname: $brandname, productName: $productName, status: $status) {
    jsonToken
    statusText
  }
}
`
