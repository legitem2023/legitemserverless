import { gql } from "@apollo/client"

export const SAVE_CROP_IMAGE = gql`
mutation Mutation($saveCropImageId: String, $file: Upload) {
  saveCropImage(id: $saveCropImageId, file: $file) {
    jsonToken
    statusText
  }
}`

export const DELETE_CHILD_INVENTORY = gql`
mutation DeleteChildInventory($deleteChildInventoryId: Int) {
  deleteChildInventory(id: $deleteChildInventoryId) {
    statusText
  }
}`

export const UPDATE_PARENT_INVENTORY = gql`
mutation Mutation($productId: String, $category: String, $productType: String, $brandname: String, $productName: String, $status: String) {
  updateParentInventory(productID: $productId, category: $category, productType: $productType, brandname: $brandname, productName: $productName, status: $status) {
    jsonToken
    statusText
  }
}
`
