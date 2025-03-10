
import { gql } from "@apollo/client"
//*************** QUERIES ***************/
// You might also want a query to get initial stream data
export const GET_STREAMS_QUERY = gql`
  query GetStreams {
    streams {
      id
      title
    }
  }
`

export const READ_ORDERS = gql`
query GetGroupedOrderHistory($emailAddress: String) {
  getGroupedOrderHistory(emailAddress: $emailAddress) {
    OrderNo
    Address
    Contact
    StatusText
    OrderStatus
    OrderHistory {
      id
      Image
      Size
      Color
      productCode
      emailAddress
      TrackingNo
      OrderNo
      Quantity
      Price
      Address
      Contact
      StoreEmail
      dateCreated
      agentEmail
    }
  }
}`
export const READ_ORDERS_RECIEVED = gql`
query GetGroupedOrderHistoryRecieved($emailAddress: String) {
  getGroupedOrderHistoryRecieved(emailAddress: $emailAddress) {
    OrderNo
    Address
    Contact
    StatusText
    OrderStatus
    OrderHistory {
      id
      Image
      Size
      Color
      productCode
      emailAddress
      TrackingNo
      OrderNo
      Quantity
      Price
      Address
      Contact
      StoreEmail
      dateCreated
      agentEmail
    }
  }
}`
export const READ_ORDERS_PACKED = gql`
query GetGroupedOrderHistoryPacked($emailAddress: String) {
  getGroupedOrderHistoryPacked(emailAddress: $emailAddress) {
    OrderNo
    Address
    Contact
    StatusText
    OrderStatus
    OrderHistory {
      id
      Image
      Size
      Color
      productCode
      emailAddress
      TrackingNo
      OrderNo
      Quantity
      Price
      Address
      Contact
      StoreEmail
      dateCreated
      agentEmail
    }
  }
}`
export const READ_ORDERS_LOGISTIC = gql`
query GetGroupedOrderHistoryLogistic($emailAddress: String) {
  getGroupedOrderHistoryLogistic(emailAddress: $emailAddress) {
    OrderNo
    Address
    Contact
    StatusText
    OrderStatus
    OrderHistory {
      id
      Image
      Size
      Color
      productCode
      emailAddress
      TrackingNo
      OrderNo
      Quantity
      Price
      Address
      Contact
      StoreEmail
      dateCreated
      agentEmail
    }
  }
}`
export const READ_ORDERS_DELIVER = gql`
query GetGroupedOrderHistoryDelivery($emailAddress: String) {
  getGroupedOrderHistoryDelivery(emailAddress: $emailAddress) {
    OrderNo
    Address
    Contact
    StatusText
    OrderStatus
    OrderHistory {
      id
      Image
      Size
      Color
      productCode
      emailAddress
      TrackingNo
      OrderNo
      Quantity
      Price
      Address
      Contact
      StoreEmail
      dateCreated
      agentEmail
    }
  }
}`
export const READ_ORDERS_DELIVERED = gql`
query GetGroupedOrderHistoryDelivered($emailAddress: String) {
  getGroupedOrderHistoryDelivered(emailAddress: $emailAddress) {
    OrderNo
    Address
    Contact
    StatusText
    OrderStatus
    OrderHistory {
      id
      Image
      Size
      Color
      productCode
      emailAddress
      TrackingNo
      OrderNo
      Quantity
      Price
      Address
      Contact
      StoreEmail
      dateCreated
      agentEmail
    }
  }
}`
export const READ_ACTIVE_USER = gql`
query ReadActiveUsers($emailAddress: String) {
  readActiveUsers(emailAddress: $emailAddress) {
    fullname
    accountEmail
  }
}`
export const READ_CATEGORY = gql`
query GetCategory {
  getCategory {
    id
    Name
    status
    icon
    image
  }
}
`
export const READ_PRODUCT_TYPES = gql`
query GetProductTypes {
  getProductTypes {
    id
    Category
    Name
  }
}
`
export const READ_NEWS = gql`
query ReadNews {
  readNews {
    id
    title
    thumbnail
    summary
    dateCreated
  }
}
`

export const READ_PERSONAL_MESSAGES = gql`
query PersonalMessages($emailAddress: String, $reciever: String) {
  personalMessages(emailAddress: $emailAddress, reciever: $reciever) {
    id
    Messages
    Sender
    Reciever
    dateSent
  }
}
`

export const GET_MESSAGES = gql`
query Messages {
  messages {
    id
    Messages
    Sender
    dateSent
    Live
    Video
  }
}`
export const GET_NAME_OF_STORE = gql`
query GetNameofStore {
  getNameofStore {
    nameOfStore
    image
    id
    email
  }
}`
export const GET_CHILD_INVENTORY = gql`
query GetChildInventory {
  getChildInventory {
    id
    thumbnail
    price
    productCode
    name
    category
    size
    discount
    color
    stock
    model
    agentEmail
    productType
    style_Code
    brandname
    TotalSoldItems
    TotalRatings
    dateCreated
    dateUpdated
    subImageFieldOut {
      ImagePath
      id
      subImageRelationChild
      subImageRelationParent
    }
    Ratings {
      Ratings
      productCode
      id
      Comment
      By
      Attachment
    }
    Views {
      productCode
    }
  }
}`
export const GET_CHILD_INVENTORY_RELATED_COLOR_SIZE = gql`
query GetChildInventory_details($styleCode: String) {
  getChildInventory_details(styleCode: $styleCode) {
    id
    thumbnail
    price
    productCode
    name
    category
    size
    discount
    color
    stock
    model
    agentEmail
    productType
    style_Code
    brandname
    TotalSoldItems
    TotalRatings
    dateCreated
    dateUpdated
    subImageFieldOut {
      ImagePath
      id
      subImageRelationChild
      subImageRelationParent
    }
    Ratings {
      Ratings
      productCode
      id
      Comment
      By
      Attachment
    }
    Views {
      productCode
    }
  }
}
`
export const GET_CATEGORY = gql`
query GetCategory {
  getCategory {
    Name
    icon
    id
    image
    status
  }
}`
export const GET_RELATED_PRODUCTS = gql`
query GetRelatedProduct {
  getRelatedProduct {
    id
    thumbnail
    price
    productCode
    name
    category
    size
    discount
    color
    stock
    model
    agentEmail
    productType
    style_Code
    brandname
    TotalSoldItems
    TotalRatings
    dateCreated
    dateUpdated
    subImageFieldOut {
      ImagePath
      id
      subImageRelationChild
      subImageRelationParent
    }
    Ratings {
      Ratings
      productCode
      id
      Comment
      By
      Attachment
    }
    Views {
      productCode
    }
  }
}`
export const GET_VIEW_PRODUCT = gql`
query GetToviewProduct($getToviewProductId: String) {
  getToviewProduct(id: $getToviewProductId) {
    agentEmail
    model
    category
    color
    creator
    dateCreated
    dateUpdated
    editor
    id
    imageReferences
    name
    parentId
    price
    productCode
    productType
    size
    status
    stock
    style_Code
    thumbnail
    productDescription
    TotalSoldItems
    TotalRatings
    subImageFieldOut {
      ImagePath
      id
      subImageRelationChild
      subImageRelationParent
    },
    Ratings {
      Ratings
      productCode
      id
      Comment
      By
      Attachment
    }
    Views {
      productCode
    }
  }
}`
export const GET_LOGIN = gql`
query GetLogin($username: String, $password: String) {
  getLogin(username: $username, password: $password) {
    jsonToken
    statusText
  }
}`
export const MANAGEMENT_INVENTORY = gql`
query GetParentInventory($emailAddress: String) {
  getParentInventory(EmailAddress: $emailAddress) {
    id
    styleCode
    name
    productType
    status
    agentEmail
    brandname
    category
    collectionItem
    dateCreated
    dateUpdated
    childInventory {
      agentEmail
      category
      color
      creator
      dateCreated
      dateUpdated
      editor
      id
    }
  }
}`
export const GET_ACCOUNTS = gql`
query GetUser {
  getUser {
    accountCode
    accountLevel
    agentIdentity
    dateCreated
    dateUpdated
    email
    image
    loginAttemp
    macAddress
    nameOfStore
    password
  }
}`
export const GET_ACCOUNT_DETAILS = gql`
query GetAccountDetails {
  getAccountDetails {
    id
    userId
    storeName
    fullname
    contactNo
    accountEmail
    Address
  }
}`
export const GET_ACCOUNT_DETAILS_ID = gql`
query GetAccountDetails($getAccountDetailsIdId: String) {
  getAccountDetails_id(id: $getAccountDetailsIdId) {
    id
    userId
    fullname
    storeName
    contactNo
    Address
    accountEmail
    defaultAddress
  }
}`
export const GET_PRODUCT_TYPES = gql`
query GetProductTypes {
  getProductTypes {
    Category
    Name
    id
  }
}`
export const GET_BRANDS = gql`
query GetBrand {
  getBrand {
    Name
    ProductType
    id
  }
}`
export const GET_NUM_OF_VIEWS = gql`
query GetNumberOfViews {
  getNumberOfViews {
    Country
    IpAddress
    count
    emailAddress
    id
    productCode
    dateVisited
  }
}`
export const GET_WEBSITE_VISITS = gql`
query GetWebsitVisits {
  getWebsitVisits {
    id
    Country
    IpAddress
    dateVisited
  }
}`
export const GET_LOCATION_DATA = gql`
query GetIp($ipAddress: String) {
  getIp(ipAddress: $ipAddress) {
    IpAddress
  }
}`
export const GET_INVENTORY_SUB_IMAGES = gql`
query GetInv_subImage {
  getInv_subImage {
    ImagePath
    id
    subImageRelationChild
    isVideo
  }
}`
//*************** QUERIES ***************/
export const GROUP_SENDER = gql`
query ReadGroupSender($emailAddress: String) {
  readGroupSender(emailAddress: $emailAddress) {
    id
    Messages
    Sender
    Reciever
    dateSent
  }
}
`

export const NEWS_POSTER = gql`
query ReadNewsPoster {
  readNewsPoster {
    postedBy
    dateCreated
  }
}
`
export const READ_PRIVACY = gql`
query ReadPrivacy {
  readPrivacy {
    content
  }
}
`

export const READ_DISCLAIMER = gql`
query ReadDisclaimer {
  readDisclaimer {
    content
  }
}
`

export const READ_ABOUT_US = gql`
query ReadAbout {
  readAbout {
    content
  }
}
`
export const READ_FAQ = gql`
query ReadFAQ {
  readFAQ {
    id
    question
    answer
  }
}
`

export const READ_FEEDBACK = gql`
query ReadFeedBack {
  readFeedBack {
    id
    productCode
    OrderNo
    Ratings
    Attachment
    Comment
    By
  }
}
`
export const READ_LIKES = gql`
query ReadLikes($accountEmail: String) {
  readLikes(accountEmail: $accountEmail) {
    productCode
    thumbnail
    price
    name
    stock
    color
    size
    agentEmail
    Likes {
      id
      productCode
      accountEmail
      dateCreated
    }
  }
}
`
//*************** MUTATION ***************/
