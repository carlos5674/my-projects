package client

// client.go
// Implements a secure file storage and sharing client using cryptographic primitives.
// Includes encrypted storage, authentication, file sharing, and revocation logic.


// Only the following imports are allowed! ANY additional imports
// - bytes
// - encoding/hex
// - encoding/json
// - errors
// - fmt
// - github.com/google/uuid
// - strconv
// - strings

import (
	"encoding/json"

	"github.com/google/uuid"

	// hex.EncodeToString(...) is useful for converting []byte to string

	// Useful for string manipulation
	"strings"

	// Useful for formatting strings (e.g. `fmt.Sprintf`).
	"fmt"

	// Useful for creating new error messages to return using errors.New("...")
	"errors"

	// Optional.
	_ "strconv"
)

// This serves two purposes: it shows you a few useful primitives,
// and suppresses warnings for imports not being used. It can be
// safely deleted!
func someUsefulThings() {

	// Creates a random UUID.
	randomUUID := uuid.New()

	// Prints the UUID as a string. %v prints the value in a default format.
	// See https://pkg.go.dev/fmt#hdr-Printing for all Golang format string flags.
	userlib.DebugMsg("Random UUID: %v", randomUUID.String())

	// Creates a UUID deterministically, from a sequence of bytes.
	hash := userlib.Hash([]byte("user-structs/alice"))
	deterministicUUID, err := uuid.FromBytes(hash[:16])
	if err != nil {
		// Normally, we would `return err` here. But, since this function doesn't return anything,
		// we can just panic to terminate execution. ALWAYS, ALWAYS, ALWAYS check for errors! Your
		// code should have hundreds of "if err != nil { return err }" statements by the end of this
		// project. You probably want to avoid using panic statements in your own code.
		panic(errors.New("An error occurred while generating a UUID: " + err.Error()))
	}
	userlib.DebugMsg("Deterministic UUID: %v", deterministicUUID.String())

	// Declares a Course struct type, creates an instance of it, and marshals it into JSON.
	type Course struct {
		name      string
		professor []byte
	}

	course := Course{"CS 161", []byte("Nicholas Weaver")}
	courseBytes, err := json.Marshal(course)
	if err != nil {
		panic(err)
	}

	userlib.DebugMsg("Struct: %v", course)
	userlib.DebugMsg("JSON Data: %v", courseBytes)

	// Generate a random private/public keypair.
	// The "_" indicates that we don't check for the error case here.
	var pk userlib.PKEEncKey
	var sk userlib.PKEDecKey
	pk, sk, _ = userlib.PKEKeyGen()
	userlib.DebugMsg("PKE Key Pair: (%v, %v)", pk, sk)

	// Here's an example of how to use HBKDF to generate a new key from an input key.
	// Tip: generate a new key everywhere you possibly can! It's easier to generate new keys on the fly
	// instead of trying to think about all of the ways a key reuse attack could be performed. It's also easier to
	// store one key and derive multiple keys from that one key, rather than
	originalKey := userlib.RandomBytes(16)
	derivedKey, err := userlib.HashKDF(originalKey, []byte("mac-key"))
	if err != nil {
		panic(err)
	}
	userlib.DebugMsg("Original Key: %v", originalKey)
	userlib.DebugMsg("Derived Key: %v", derivedKey)

	// A couple of tips on converting between string and []byte:
	// To convert from string to []byte, use []byte("some-string-here")
	// To convert from []byte to string for debugging, use fmt.Sprintf("hello world: %s", some_byte_arr).
	// To convert from []byte to string for use in a hashmap, use hex.EncodeToString(some_byte_arr).
	// When frequently converting between []byte and string, just marshal and unmarshal the data.
	//
	// Read more: https://go.dev/blog/strings

	// Here's an example of string interpolation!
	_ = fmt.Sprintf("%s_%d", "file", 1)
}

// This is the type definition for the User struct.
// A Go struct is like a Python or Java class - it can have attributes
// (e.g. like the Username attribute) and methods (e.g. like the StoreFile method below).
type User struct {
	Username      string
	SourceKey     []byte
	PKEPrivateKey userlib.PKEDecKey
	DSSignKey     userlib.DSSignKey

	// You can add other attributes here if you want! But note that in order for attributes to
	// be included when this struct is serialized to/from JSON, they must be capitalized.
	// On the flipside, if you have an attribute that you want to be able to access from
	// this struct's methods, but you DON'T want that value to be included in the serialized value
	// of this struct that's stored in datastore, then you can use a "private" variable (e.g. one that
	// begins with a lowercase letter).
}

type File struct {
	Role                  string
	MetadataUUID          uuid.UUID
	MetadataEncryptionKey []byte
	MetadataHMACKey       []byte
}

type FileMetadata struct {
	Owner                    string
	CurrentVersion           int
	Appends                  string
	InvitedList              map[string]InvitationData
	FileContentUUID          uuid.UUID
	FileContentEncryptionKey []byte
	FileContentHMACKey       []byte
	FileContentSourceKey     []byte
}

type FileContent struct {
	Content []byte
}

type Invitation struct {
	FileUUID          uuid.UUID
	FileEncryptionKey []byte
	FileHMACKey       []byte
	FileSymKey        []byte
}

type InvitationData struct {
	Status         string
	Filename       string
	SenderFilename string
	Sender         string
	SourceKey      []byte
}

// NOTE: The following methods have toy (insecure!) implementations.

func InitUser(username string, password string) (userdataptr *User, err error) {
	if _, ok := userlib.KeystoreGet(username + "_enc"); ok {
		return nil, errors.New("user already exists")
	}

	if username == "" {
		return nil, errors.New("username cannot be empty")
	}

	salt := userlib.Hash([]byte(username))
	userKey := userlib.Argon2Key([]byte(password), salt, 16)

	pkePublicKey, pkePrivateKey, err := userlib.PKEKeyGen()
	if err != nil {
		return nil, err
	}
	dsSignKey, dsVerifyKey, err := userlib.DSKeyGen()
	if err != nil {
		return nil, err
	}

	userlib.KeystoreSet(username+"_enc", pkePublicKey)
	userlib.KeystoreSet(username+"_verify", dsVerifyKey)

	storedUser := User{
		Username:      username,
		SourceKey:     userlib.RandomBytes(16),
		PKEPrivateKey: pkePrivateKey,
		DSSignKey:     dsSignKey,
	}
	storedUserBytes, err := json.Marshal(storedUser)
	if err != nil {
		return nil, err
	}

	iv := userlib.RandomBytes(16)
	ciphertext := userlib.SymEnc(userKey, iv, storedUserBytes)

	uuidBytes := userlib.Hash([]byte(username))[:16]
	userUUID, _ := uuid.FromBytes(uuidBytes)

	hmacSalt := userlib.Hash([]byte(password + username))
	hmacKey := userlib.Argon2Key([]byte(username), hmacSalt, 16)
	hmac, err := userlib.HMACEval(hmacKey, ciphertext)
	if err != nil {
		return nil, err
	}
	userlib.DatastoreSet(userUUID, append(ciphertext, hmac...))

	return &storedUser, err
}

func GetUser(username string, password string) (userdataptr *User, err error) {
	_, ok := userlib.KeystoreGet(username + "_enc")
	if !ok {
		return nil, errors.New("user does not exist")
	}

	uuidBytes := userlib.Hash([]byte(username))[:16]
	userUUID, _ := uuid.FromBytes(uuidBytes)

	ciphertext, ok := userlib.DatastoreGet(userUUID)
	if !ok {
		return nil, errors.New("user's data does not exist")
	}

	hmacSalt := userlib.Hash([]byte(password + username))
	hmacKey := userlib.Argon2Key([]byte(username), hmacSalt, 16)
	hmac, err := userlib.HMACEval(hmacKey, ciphertext[:len(ciphertext)-64])
	if err != nil {
		return nil, err
	}
	equals := userlib.HMACEqual(hmac, ciphertext[len(ciphertext)-64:])
	if !equals {
		return nil, errors.New("HMAC's do not match, data has been tampered with")
	}

	salt := userlib.Hash([]byte(username))
	userKey := userlib.Argon2Key([]byte(password), salt, 16)
	ciphertext = userlib.SymDec(userKey, ciphertext[:len(ciphertext)-64])
	var storedUser User
	err = json.Unmarshal(ciphertext, &storedUser)
	if err != nil {
		return nil, err
	}
	return &storedUser, err
}

func (userdata *User) StoreFile(filename string, content []byte) (err error) {
	fileStructUUID, err := uuid.FromBytes(userlib.Hash([]byte(filename + userdata.Username))[:16])
	userFileStruct, ok := userlib.DatastoreGet(fileStructUUID)

	encKey, err := userlib.HashKDF(userdata.SourceKey, []byte("fileStructEncryptionKey"))
	encKey = encKey[:16]
	if err != nil {
		return err
	}

	hmacKey, err := userlib.HashKDF(userdata.SourceKey, []byte("fileStructHMACKey"))
	hmacKey = hmacKey[:16]
	if err != nil {
		return err
	}

	var currFileStruct File
	var currMetadata FileMetadata
	var currFileContent FileContent
	if ok {
		fileStructEncryption := userFileStruct[:len(userFileStruct)-64]
		hmac, err := userlib.HMACEval(hmacKey, fileStructEncryption)
		if err != nil {
			return err
		}
		equals := userlib.HMACEqual(hmac, userFileStruct[len(userFileStruct)-64:])
		if !equals {
			return errors.New("HMAC's do not match, data has been tampered with")
		}
		fileStructData := userlib.SymDec(encKey, fileStructEncryption)
		err = json.Unmarshal(fileStructData, &currFileStruct)
		if err != nil {
			return err
		}

		fileMetadataUUID := currFileStruct.MetadataUUID
		fileMetadata, ok := userlib.DatastoreGet(fileMetadataUUID)
		if !ok {
			return errors.New("file metadata not found")
		}
		fileMetadataEncryption := fileMetadata[:len(fileMetadata)-64]
		metadataHMACKey := currFileStruct.MetadataHMACKey
		metadataHMAC, err := userlib.HMACEval(metadataHMACKey, fileMetadataEncryption)
		if err != nil {
			return err
		}
		metadataEquals := userlib.HMACEqual(metadataHMAC, fileMetadata[len(fileMetadata)-64:])
		if !metadataEquals {
			return errors.New("HMAC's do not match, data has been tampered with")
		}
		metadataEncryptionKey := currFileStruct.MetadataEncryptionKey
		fileMetadataData := userlib.SymDec(metadataEncryptionKey, fileMetadataEncryption)
		err = json.Unmarshal(fileMetadataData, &currMetadata)
		if err != nil {
			return err
		}
		fileContentUUID := currMetadata.FileContentUUID
		fileContent, ok := userlib.DatastoreGet(fileContentUUID)
		if !ok {
			return errors.New("file content not found")
		}
		fileContentEncryption := fileContent[:len(fileContent)-64]
		fileContentHMACKey := currMetadata.FileContentHMACKey
		fileContentHMAC, err := userlib.HMACEval(fileContentHMACKey, fileContentEncryption)
		if err != nil {
			return err
		}
		fileContentEquals := userlib.HMACEqual(fileContentHMAC, fileContent[len(fileContent)-64:])
		if !fileContentEquals {
			return errors.New("HMAC's do not match, data has been tampered with")
		}
		fileContentEncryptionKey := currMetadata.FileContentEncryptionKey
		fileContentData := userlib.SymDec(fileContentEncryptionKey, fileContentEncryption)
		err = json.Unmarshal(fileContentData, &currFileContent)
		if err != nil {
			return err
		}
		currFileContent.Content = content
		currMetadata.CurrentVersion += 1
	} else {
		currFileStruct = File{
			Role:                  "owner",
			MetadataUUID:          uuid.New(),
			MetadataEncryptionKey: userlib.RandomBytes(16),
			MetadataHMACKey:       userlib.RandomBytes(16),
		}
		currMetadata = FileMetadata{
			Owner:                    userdata.Username,
			CurrentVersion:           1,
			Appends:                  "",
			InvitedList:              make(map[string]InvitationData),
			FileContentUUID:          uuid.New(),
			FileContentEncryptionKey: userlib.RandomBytes(16),
			FileContentHMACKey:       userlib.RandomBytes(16),
			FileContentSourceKey:     userlib.RandomBytes(16),
		}
		currFileContent = FileContent{
			Content: content,
		}
	}
	fileContentData, err := json.Marshal(currFileContent)
	if err != nil {
		return err
	}
	fileContentIV := userlib.RandomBytes(16)
	fileContentEncryption := userlib.SymEnc(currMetadata.FileContentEncryptionKey, fileContentIV, fileContentData)
	fileContentHMAC, err := userlib.HMACEval(currMetadata.FileContentHMACKey, fileContentEncryption)
	if err != nil {
		return err
	}
	fileContent := append(fileContentEncryption, fileContentHMAC...)
	userlib.DatastoreSet(currMetadata.FileContentUUID, fileContent)

	fileMetadataData, err := json.Marshal(currMetadata)
	if err != nil {
		return err
	}
	fileMetadataIV := userlib.RandomBytes(16)
	fileMetadataEncryption := userlib.SymEnc(currFileStruct.MetadataEncryptionKey, fileMetadataIV, fileMetadataData)
	fileMetadataHMAC, err := userlib.HMACEval(currFileStruct.MetadataHMACKey, fileMetadataEncryption)
	if err != nil {
		return err
	}
	fileMetadata := append(fileMetadataEncryption, fileMetadataHMAC...)
	userlib.DatastoreSet(currFileStruct.MetadataUUID, fileMetadata)

	fileStructData, err := json.Marshal(currFileStruct)
	if err != nil {
		return err
	}
	fileStructIV := userlib.RandomBytes(16)
	fileStructEncryption := userlib.SymEnc(encKey, fileStructIV, fileStructData)
	fileStructHMAC, err := userlib.HMACEval(hmacKey, fileStructEncryption)
	fileStruct := append(fileStructEncryption, fileStructHMAC...)
	userlib.DatastoreSet(fileStructUUID, fileStruct)
	return err
}

func (userdata *User) AppendToFile(filename string, content []byte) error {
	fileStructUUID, err := uuid.FromBytes(userlib.Hash([]byte(filename + userdata.Username))[:16])
	if err != nil {
		return err
	}
	userFileStruct, ok := userlib.DatastoreGet(fileStructUUID)
	if !ok {
		return errors.New("file not found")
	}
	encKey, err := userlib.HashKDF(userdata.SourceKey, []byte("fileStructEncryptionKey"))
	encKey = encKey[:16]
	if err != nil {
		return err
	}
	hmacKey, err := userlib.HashKDF(userdata.SourceKey, []byte("fileStructHMACKey"))
	hmacKey = hmacKey[:16]
	fileStructEncryption := userFileStruct[:len(userFileStruct)-64]
	hmac, err := userlib.HMACEval(hmacKey, fileStructEncryption)
	if err != nil {
		return err
	}
	equals := userlib.HMACEqual(hmac, userFileStruct[len(userFileStruct)-64:])
	if !equals {
		return errors.New("HMAC's do not match, data has been tampered with")
	}
	fileStructData := userlib.SymDec(encKey, fileStructEncryption)
	var currFileStruct File
	err = json.Unmarshal(fileStructData, &currFileStruct)
	if err != nil {
		return err
	}

	fileMetadataUUID := currFileStruct.MetadataUUID
	fileMetadata, ok := userlib.DatastoreGet(fileMetadataUUID)
	if !ok {
		return errors.New("file metadata not found")
	}
	fileMetadataEncryption := fileMetadata[:len(fileMetadata)-64]
	metadataHMACKey := currFileStruct.MetadataHMACKey
	metadataHMAC, err := userlib.HMACEval(metadataHMACKey, fileMetadataEncryption)
	if err != nil {
		return err
	}
	metadataEquals := userlib.HMACEqual(metadataHMAC, fileMetadata[len(fileMetadata)-64:])
	if !metadataEquals {
		return errors.New("HMAC's do not match, data has been tampered with")
	}
	metadataEncryptionKey := currFileStruct.MetadataEncryptionKey
	fileMetadataData := userlib.SymDec(metadataEncryptionKey, fileMetadataEncryption)
	var currMetadata FileMetadata
	err = json.Unmarshal(fileMetadataData, &currMetadata)
	if err != nil {
		return err
	}
	currMetadata.CurrentVersion += 1
	currMetadata.Appends += "I"

	appendEncKey, err := userlib.HashKDF(currMetadata.FileContentSourceKey, []byte(currMetadata.Appends+"appendEncryptionKey"))
	appendEncKey = appendEncKey[:16]
	if err != nil {
		return err
	}
	appendHMACKey, err := userlib.HashKDF(currMetadata.FileContentSourceKey, []byte(currMetadata.Appends+"appendHMACKey"))
	appendHMACKey = appendHMACKey[:16]
	if err != nil {
		return err
	}

	var currFileContent FileContent
	fileContentHash, err := userlib.HashKDF(currMetadata.FileContentSourceKey, []byte(currMetadata.Appends))
	fileContentHash = fileContentHash[:16]
	fileContentUUID, err := uuid.FromBytes(fileContentHash)
	if err != nil {
		return err
	}
	currFileContent.Content = content
	fileContentData, err := json.Marshal(currFileContent)
	if err != nil {
		return err
	}
	fileContentIV := userlib.RandomBytes(16)
	fileContentEncryption := userlib.SymEnc(appendEncKey, fileContentIV, fileContentData)
	fileContentHMAC, err := userlib.HMACEval(appendHMACKey, fileContentEncryption)
	if err != nil {
		return err
	}
	fileContent := append(fileContentEncryption, fileContentHMAC...)
	userlib.DatastoreSet(fileContentUUID, fileContent)
	fileMetadataData, err = json.Marshal(currMetadata)
	if err != nil {
		return err
	}
	fileMetadataIV := userlib.RandomBytes(16)
	fileMetadataEncryption = userlib.SymEnc(currFileStruct.MetadataEncryptionKey, fileMetadataIV, fileMetadataData)
	fileMetadataHMAC, err := userlib.HMACEval(currFileStruct.MetadataHMACKey, fileMetadataEncryption)
	fileMetadata = append(fileMetadataEncryption, fileMetadataHMAC...)
	userlib.DatastoreSet(currFileStruct.MetadataUUID, fileMetadata)
	return err
}

func (userdata *User) LoadFile(filename string) (content []byte, err error) {
	fileStructUUID, err := uuid.FromBytes(userlib.Hash([]byte(filename + userdata.Username))[:16])
	if err != nil {
		return nil, err
	}
	userFileStruct, ok := userlib.DatastoreGet(fileStructUUID)
	if !ok {
		return nil, errors.New(strings.ToTitle("file not found"))
	}
	encKey, err := userlib.HashKDF(userdata.SourceKey, []byte("fileStructEncryptionKey"))
	encKey = encKey[:16]
	if err != nil {
		return nil, err
	}
	hmacKey, err := userlib.HashKDF(userdata.SourceKey, []byte("fileStructHMACKey"))
	hmacKey = hmacKey[:16]
	if err != nil {
		return nil, err
	}
	fileStructEncryption := userFileStruct[:len(userFileStruct)-64]
	hmac, err := userlib.HMACEval(hmacKey, fileStructEncryption)
	if err != nil {
		return nil, err
	}
	equals := userlib.HMACEqual(hmac, userFileStruct[len(userFileStruct)-64:])
	if !equals {
		return nil, errors.New("HMAC's do not match, data has been tampered with")
	}
	fileStructData := userlib.SymDec(encKey, fileStructEncryption)
	var currFileStruct File
	err = json.Unmarshal(fileStructData, &currFileStruct)
	if err != nil {
		return nil, err
	}

	fileMetadataUUID := currFileStruct.MetadataUUID
	fileMetadata, ok := userlib.DatastoreGet(fileMetadataUUID)
	if !ok {
		return nil, errors.New("file metadata not found")
	}
	fileMetadataEncryption := fileMetadata[:len(fileMetadata)-64]
	metadataHMACKey := currFileStruct.MetadataHMACKey
	metadataHMAC, err := userlib.HMACEval(metadataHMACKey, fileMetadataEncryption)
	if err != nil {
		return nil, err
	}
	metadataEquals := userlib.HMACEqual(metadataHMAC, fileMetadata[len(fileMetadata)-64:])
	if !metadataEquals {
		return nil, errors.New("HMAC's do not match, data has been tampered with")
	}
	metadataEncryptionKey := currFileStruct.MetadataEncryptionKey
	fileMetadataData := userlib.SymDec(metadataEncryptionKey, fileMetadataEncryption)
	var currMetadata FileMetadata
	err = json.Unmarshal(fileMetadataData, &currMetadata)
	if err != nil {
		return nil, err
	}

	fileContentUUID := currMetadata.FileContentUUID
	fileContent, ok := userlib.DatastoreGet(fileContentUUID)
	if !ok {
		return nil, errors.New("file content not found")
	}
	fileContentEncryption := fileContent[:len(fileContent)-64]
	fileContentHMACKey := currMetadata.FileContentHMACKey
	fileContentHMAC, err := userlib.HMACEval(fileContentHMACKey, fileContentEncryption)
	if err != nil {
		return nil, err
	}
	fileContentEquals := userlib.HMACEqual(fileContentHMAC, fileContent[len(fileContent)-64:])
	if !fileContentEquals {
		return nil, errors.New("HMAC's do not match, data has been tampered with")
	}
	fileContentEncryptionKey := currMetadata.FileContentEncryptionKey
	fileContentData := userlib.SymDec(fileContentEncryptionKey, fileContentEncryption)
	var currFileContent FileContent
	err = json.Unmarshal(fileContentData, &currFileContent)
	if err != nil {
		return nil, err
	}
	fullFileContent := currFileContent.Content
	for i := 0; i < len(currMetadata.Appends); i++ {
		appendHash, err := userlib.HashKDF(currMetadata.FileContentSourceKey, []byte(currMetadata.Appends[:i+1]))
		appendHash = appendHash[:16]
		appendUUID, err := uuid.FromBytes(appendHash)
		if err != nil {
			return nil, err
		}
		appendContent, ok := userlib.DatastoreGet(appendUUID)
		if !ok {
			return nil, errors.New("file content not found")
		}
		appendContentEncryption := appendContent[:len(appendContent)-64]
		appendContentEncryptionKey, err := userlib.HashKDF(currMetadata.FileContentSourceKey, []byte(currMetadata.Appends[:i+1]+"appendEncryptionKey"))
		appendContentEncryptionKey = appendContentEncryptionKey[:16]
		if err != nil {
			return nil, err
		}
		appendHMACKey, err := userlib.HashKDF(currMetadata.FileContentSourceKey, []byte(currMetadata.Appends[:i+1]+"appendHMACKey"))
		appendHMACKey = appendHMACKey[:16]
		if err != nil {
			return nil, err
		}
		appendHMAC, err := userlib.HMACEval(appendHMACKey, appendContentEncryption)
		if err != nil {
			return nil, err
		}
		appendEquals := userlib.HMACEqual(appendHMAC, appendContent[len(appendContent)-64:])
		if !appendEquals {
			return nil, errors.New("HMAC's do not match, data has been tampered with")
		}
		appendContentData := userlib.SymDec(appendContentEncryptionKey, appendContentEncryption)
		var currAppend FileContent
		err = json.Unmarshal(appendContentData, &currAppend)
		if err != nil {
			return nil, err
		}
		fullFileContent = append(fullFileContent, currAppend.Content...)
	}
	return fullFileContent, err
}

func (userdata *User) CreateInvitation(filename string, recipientUsername string) (invitationPtr uuid.UUID, err error) {
	fileStructUUID, err := uuid.FromBytes(userlib.Hash([]byte(filename + userdata.Username))[:16])
	if err != nil {
		return uuid.Nil, err
	}
	userFileStruct, ok := userlib.DatastoreGet(fileStructUUID)
	if !ok {
		return uuid.Nil, errors.New("file not found")
	}
	recipientPublicKey, ok := userlib.KeystoreGet(recipientUsername + "_enc")
	if !ok {
		return uuid.Nil, errors.New("recipient does not exist")
	}
	encKey, err := userlib.HashKDF(userdata.SourceKey, []byte("fileStructEncryptionKey"))
	encKey = encKey[:16]
	if err != nil {
		return uuid.Nil, err
	}
	hmacKey, err := userlib.HashKDF(userdata.SourceKey, []byte("fileStructHMACKey"))
	hmacKey = hmacKey[:16]
	if err != nil {
		return uuid.Nil, err
	}
	fileStructEncryption := userFileStruct[:len(userFileStruct)-64]
	hmac, err := userlib.HMACEval(hmacKey, fileStructEncryption)
	if err != nil {
		return uuid.Nil, err
	}
	equals := userlib.HMACEqual(hmac, userFileStruct[len(userFileStruct)-64:])
	if !equals {
		return uuid.Nil, errors.New("HMAC's do not match, data has been tampered with")
	}
	fileStructData := userlib.SymDec(encKey, fileStructEncryption)
	var currFileStruct File
	err = json.Unmarshal(fileStructData, &currFileStruct)
	if err != nil {
		return uuid.Nil, err
	}

	fileMetadataUUID := currFileStruct.MetadataUUID
	fileMetadata, ok := userlib.DatastoreGet(fileMetadataUUID)
	if !ok {
		return uuid.Nil, errors.New("file metadata not found")
	}
	fileMetadataEncryption := fileMetadata[:len(fileMetadata)-64]
	metadataHMACKey := currFileStruct.MetadataHMACKey
	metadataHMAC, err := userlib.HMACEval(metadataHMACKey, fileMetadataEncryption)
	if err != nil {
		return uuid.Nil, err
	}
	metadataEquals := userlib.HMACEqual(metadataHMAC, fileMetadata[len(fileMetadata)-64:])
	if !metadataEquals {
		return uuid.Nil, errors.New("HMAC's do not match, data has been tampered with")
	}
	metadataEncryptionKey := currFileStruct.MetadataEncryptionKey
	fileMetadataData := userlib.SymDec(metadataEncryptionKey, fileMetadataEncryption)
	var currMetadata FileMetadata
	err = json.Unmarshal(fileMetadataData, &currMetadata)
	if err != nil {
		return uuid.Nil, err
	}

	invitationDataStruct := InvitationData{
		Status:         "invited",
		Filename:       "Invitation not yet accepted",
		SenderFilename: filename,
		Sender:         userdata.Username,
	}
	currMetadata.InvitedList[recipientUsername] = invitationDataStruct
	fileMetadataData, err = json.Marshal(currMetadata)
	if err != nil {
		return uuid.Nil, err
	}
	fileMetadataIV := userlib.RandomBytes(16)
	fileMetadataEncryption = userlib.SymEnc(currFileStruct.MetadataEncryptionKey, fileMetadataIV, fileMetadataData)
	fileMetadataHMAC, err := userlib.HMACEval(currFileStruct.MetadataHMACKey, fileMetadataEncryption)
	if err != nil {
		return uuid.Nil, err
	}
	fileMetadata = append(fileMetadataEncryption, fileMetadataHMAC...)
	userlib.DatastoreSet(currFileStruct.MetadataUUID, fileMetadata)

	sharedFileStruct := File{
		Role:                  "invited",
		MetadataUUID:          currFileStruct.MetadataUUID,
		MetadataEncryptionKey: currFileStruct.MetadataEncryptionKey,
		MetadataHMACKey:       currFileStruct.MetadataHMACKey,
	}
	sharedFileUUID := uuid.New()
	sharedFileData, err := json.Marshal(sharedFileStruct)
	if err != nil {
		return uuid.Nil, err
	}
	sharedIV := userlib.RandomBytes(16)
	sharedEncryptionKey := userlib.RandomBytes(16)
	sharedHMACKey := userlib.RandomBytes(16)
	sharedEncryption := userlib.SymEnc(sharedEncryptionKey, sharedIV, sharedFileData)
	sharedHMAC, err := userlib.HMACEval(sharedHMACKey, sharedEncryption)
	if err != nil {
		return uuid.Nil, err
	}
	sharedFile := append(sharedEncryption, sharedHMAC...)
	userlib.DatastoreSet(sharedFileUUID, sharedFile)

	invitationStruct := Invitation{
		FileUUID:          sharedFileUUID,
		FileEncryptionKey: sharedEncryptionKey,
		FileHMACKey:       sharedHMACKey,
		FileSymKey:        userlib.RandomBytes(16),
	}
	invitationUUID, err := uuid.FromBytes(userlib.Hash([]byte(filename + recipientUsername + userdata.Username))[:16])
	if err != nil {
		return uuid.Nil, err
	}
	invitationData, err := json.Marshal(invitationStruct)
	if err != nil {
		return uuid.Nil, err
	}
	invitationData = append(invitationData, []byte("_"+currMetadata.Owner)...)
	senderDSSignKey := userdata.DSSignKey
	invitationSymKey := userlib.RandomBytes(16)
	invitationEncryption := userlib.SymEnc(invitationSymKey, userlib.RandomBytes(16), invitationData)
	encryptedSymKey, err := userlib.PKEEnc(recipientPublicKey, invitationSymKey)
	if err != nil {
		return uuid.Nil, err
	}
	invitationSignature, err := userlib.DSSign(senderDSSignKey, invitationEncryption)
	if err != nil {
		return uuid.Nil, err
	}
	invitation := append(encryptedSymKey, invitationEncryption...)
	invitation = append(invitation, invitationSignature...)
	userlib.DatastoreSet(invitationUUID, invitation)
	return invitationUUID, err
}

func (userdata *User) AcceptInvitation(senderUsername string, invitationPtr uuid.UUID, filename string) error {
	fileStructUUID, err := uuid.FromBytes(userlib.Hash([]byte(filename + userdata.Username))[:16])
	if err != nil {
		return err
	}
	_, ok := userlib.DatastoreGet(fileStructUUID)
	if ok {
		return errors.New("filename already exists")
	}
	invitation, ok := userlib.DatastoreGet(invitationPtr)
	if !ok {
		return errors.New("invitation not found")
	}

	encryptedSymKey := invitation[:256]
	invitationEncryption := invitation[256 : len(invitation)-256]
	invitationSignature := invitation[len(invitation)-256:]

	recipientPrivateKey := userdata.PKEPrivateKey
	invitationSymKey, err := userlib.PKEDec(recipientPrivateKey, encryptedSymKey)
	if err != nil {
		return errors.New("failed to decrypt invitation sym key")
	}
	invitationData := userlib.SymDec(invitationSymKey, invitationEncryption)
	splitInvitationData := strings.Split(string(invitationData), "_")

	ownerVerificationKey, ok := userlib.KeystoreGet(splitInvitationData[1] + "_verify")
	if !ok {
		return errors.New("owner does not exist")
	}
	senderVerificationKey, ok := userlib.KeystoreGet(senderUsername + "_verify")
	if !ok {
		return errors.New("sender does not exist")
	}
	verifyOwner := userlib.DSVerify(ownerVerificationKey, invitationEncryption, invitationSignature)
	verifySender := userlib.DSVerify(senderVerificationKey, invitationEncryption, invitationSignature)
	if verifySender != nil {
		if verifyOwner != nil {
			return errors.New("signature verification failed")
		}
	}

	var invitationStruct Invitation
	err = json.Unmarshal([]byte(splitInvitationData[0]), &invitationStruct)
	if err != nil {
		return errors.New("failed to unmarshal invitation data")
	}

	sharedFileUUID := invitationStruct.FileUUID
	sharedFile, ok := userlib.DatastoreGet(sharedFileUUID)
	if !ok {
		return errors.New("shared file not found")
	}
	sharedFileEncryption := sharedFile[:len(sharedFile)-64]
	sharedHMACKey := invitationStruct.FileHMACKey
	sharedHMAC, err := userlib.HMACEval(sharedHMACKey, sharedFileEncryption)
	if err != nil {
		return errors.New("failed to compute HMAC")
	}
	sharedEquals := userlib.HMACEqual(sharedHMAC, sharedFile[len(sharedFile)-64:])
	if !sharedEquals {
		return errors.New("HMAC's do not match, data has been tampered with")
	}
	sharedFileEncryptionKey := invitationStruct.FileEncryptionKey
	sharedFileData := userlib.SymDec(sharedFileEncryptionKey, sharedFileEncryption)
	var sharedFileStruct File
	err = json.Unmarshal(sharedFileData, &sharedFileStruct)
	if err != nil {
		return errors.New("failed to unmarshal shared file data")
	}

	fileMetadataUUID := sharedFileStruct.MetadataUUID
	fileMetadata, ok := userlib.DatastoreGet(fileMetadataUUID)
	if !ok {
		return errors.New("file metadata not found")
	}
	fileMetadataEncryption := fileMetadata[:len(fileMetadata)-64]
	metadataHMACKey := sharedFileStruct.MetadataHMACKey
	metadataHMAC, err := userlib.HMACEval(metadataHMACKey, fileMetadataEncryption)
	if err != nil {
		return err
	}
	metadataEquals := userlib.HMACEqual(metadataHMAC, fileMetadata[len(fileMetadata)-64:])
	if !metadataEquals {
		return errors.New("HMAC's do not match, data has been tampered with")
	}
	metadataEncryptionKey := sharedFileStruct.MetadataEncryptionKey
	fileMetadataData := userlib.SymDec(metadataEncryptionKey, fileMetadataEncryption)
	var sharedMetadata FileMetadata
	err = json.Unmarshal(fileMetadataData, &sharedMetadata)
	if err != nil {
		return err
	}

	invitationInfo := sharedMetadata.InvitedList[userdata.Username]
	invitationInfo.Status = "accepted"
	invitationInfo.Filename = filename
	invitationInfo.SourceKey = userdata.SourceKey
	sharedMetadata.InvitedList[userdata.Username] = invitationInfo
	fileMetadataData, err = json.Marshal(sharedMetadata)
	if err != nil {
		return err
	}
	fileMetadataIV := userlib.RandomBytes(16)
	fileMetadataEncryption = userlib.SymEnc(sharedFileStruct.MetadataEncryptionKey, fileMetadataIV, fileMetadataData)
	fileMetadataHMAC, err := userlib.HMACEval(sharedFileStruct.MetadataHMACKey, fileMetadataEncryption)
	if err != nil {
		return err
	}
	fileMetadata = append(fileMetadataEncryption, fileMetadataHMAC...)
	userlib.DatastoreSet(sharedFileStruct.MetadataUUID, fileMetadata)

	acceptedFileUUID, err := uuid.FromBytes(userlib.Hash([]byte(filename + userdata.Username))[:16])
	if err != nil {
		return err
	}
	encKey, err := userlib.HashKDF(userdata.SourceKey, []byte("fileStructEncryptionKey"))
	encKey = encKey[:16]
	if err != nil {
		return err
	}
	hmacKey, err := userlib.HashKDF(userdata.SourceKey, []byte("fileStructHMACKey"))
	hmacKey = hmacKey[:16]
	if err != nil {
		return err
	}
	fileStructData, err := json.Marshal(sharedFileStruct)
	if err != nil {
		return err
	}
	fileStructIV := userlib.RandomBytes(16)
	fileStructEncryption := userlib.SymEnc(encKey, fileStructIV, fileStructData)
	fileStructHMAC, err := userlib.HMACEval(hmacKey, fileStructEncryption)
	if err != nil {
		return err
	}
	fileStruct := append(fileStructEncryption, fileStructHMAC...)
	userlib.DatastoreSet(acceptedFileUUID, fileStruct)
	userlib.DatastoreDelete(sharedFileUUID)
	return err
}

func (userdata *User) RevokeAccess(filename string, recipientUsername string) error {
	fileStructUUID, err := uuid.FromBytes(userlib.Hash([]byte(filename + userdata.Username))[:16])
	if err != nil {
		return err
	}
	userFileStruct, ok := userlib.DatastoreGet(fileStructUUID)
	if !ok {
		return errors.New("file not found")
	}
	encKey, err := userlib.HashKDF(userdata.SourceKey, []byte("fileStructEncryptionKey"))
	encKey = encKey[:16]
	if err != nil {
		return err
	}
	hmacKey, err := userlib.HashKDF(userdata.SourceKey, []byte("fileStructHMACKey"))
	hmacKey = hmacKey[:16]
	if err != nil {
		return err
	}
	fileStructEncryption := userFileStruct[:len(userFileStruct)-64]
	hmac, err := userlib.HMACEval(hmacKey, fileStructEncryption)
	if err != nil {
		return err
	}
	equals := userlib.HMACEqual(hmac, userFileStruct[len(userFileStruct)-64:])
	if !equals {
		return errors.New("HMAC's do not match, data has been tampered with")
	}
	fileStructData := userlib.SymDec(encKey, fileStructEncryption)
	var currFileStruct File
	err = json.Unmarshal(fileStructData, &currFileStruct)
	if err != nil {
		return err
	}

	fileMetadataUUID := currFileStruct.MetadataUUID
	fileMetadata, ok := userlib.DatastoreGet(fileMetadataUUID)
	if !ok {
		return errors.New("file metadata not found")
	}
	fileMetadataEncryption := fileMetadata[:len(fileMetadata)-64]
	metadataHMACKey := currFileStruct.MetadataHMACKey
	metadataHMAC, err := userlib.HMACEval(metadataHMACKey, fileMetadataEncryption)
	if err != nil {
		return err
	}
	metadataEquals := userlib.HMACEqual(metadataHMAC, fileMetadata[len(fileMetadata)-64:])
	if !metadataEquals {
		return errors.New("HMAC's do not match, data has been tampered with")
	}
	metadataEncryptionKey := currFileStruct.MetadataEncryptionKey
	fileMetadataData := userlib.SymDec(metadataEncryptionKey, fileMetadataEncryption)
	var currMetadata FileMetadata
	err = json.Unmarshal(fileMetadataData, &currMetadata)
	if err != nil {
		return err
	}

	revokeList := make(map[string]string)
	revokeList[recipientUsername] = userdata.Username
	revokeQueue := []string{recipientUsername}
	for len(revokeQueue) > 0 {
		currentUsername := revokeQueue[0]
		revokeQueue = revokeQueue[1:]
		for key, value := range currMetadata.InvitedList {
			if currentUsername == value.Sender {
				if _, ok := revokeList[key]; !ok {
					revokeList[key] = value.Sender
					revokeQueue = append(revokeQueue, key)
				}
			}
		}
	}

	for key, value := range revokeList {
		invitationInfo := currMetadata.InvitedList[key]
		invitationUUID, err := uuid.FromBytes(userlib.Hash([]byte(invitationInfo.SenderFilename + key + value))[:16])
		if err != nil {
			return err
		}
		_, ok := userlib.DatastoreGet(invitationUUID)
		if !ok {
			return errors.New("invitation not found: file is not shared with this user")
		}
		userlib.DatastoreDelete(invitationUUID)
		if invitationInfo.Status == "accepted" {
			sharedFileUUID, err := uuid.FromBytes(userlib.Hash([]byte(invitationInfo.Filename + key))[:16])
			if err != nil {
				return err
			}
			_, ok = userlib.DatastoreGet(sharedFileUUID)
			if ok {
				userlib.DatastoreDelete(sharedFileUUID)
			}
		}
		delete(currMetadata.InvitedList, key)
	}

	newMetadataUUID := uuid.New()
	newMetadataEncryptionKey := userlib.RandomBytes(16)
	newMetadataHMACKey := userlib.RandomBytes(16)

	newFilecontentSourceKey := userlib.RandomBytes(16)
	newFilecontentUUID := uuid.New()
	newFilecontentEncryptionKey := userlib.RandomBytes(16)
	newFilecontentHMACKey := userlib.RandomBytes(16)

	fileContentUUID := currMetadata.FileContentUUID
	fileContent, ok := userlib.DatastoreGet(fileContentUUID)
	if !ok {
		return errors.New("file content not found")
	}
	fileContentEncryption := fileContent[:len(fileContent)-64]
	fileContentHMACKey := currMetadata.FileContentHMACKey
	fileContentHMAC, err := userlib.HMACEval(fileContentHMACKey, fileContentEncryption)
	if err != nil {
		return err
	}
	fileContentEquals := userlib.HMACEqual(fileContentHMAC, fileContent[len(fileContent)-64:])
	if !fileContentEquals {
		return errors.New("HMAC's do not match, data has been tampered with")
	}
	fileContentEncryptionKey := currMetadata.FileContentEncryptionKey
	fileContentData := userlib.SymDec(fileContentEncryptionKey, fileContentEncryption)
	var currFileContent FileContent
	err = json.Unmarshal(fileContentData, &currFileContent)
	if err != nil {
		return err
	}
	userlib.DatastoreDelete(fileContentUUID)
	for i := 0; i < len(currMetadata.Appends); i++ {
		appendHash, err := userlib.HashKDF(currMetadata.FileContentSourceKey, []byte(currMetadata.Appends[:i+1]))
		appendHash = appendHash[:16]
		appendUUID, err := uuid.FromBytes(appendHash)
		if err != nil {
			return err
		}
		appendContent, ok := userlib.DatastoreGet(appendUUID)
		if !ok {
			return errors.New("file content not found")
		}
		appendContentEncryption := appendContent[:len(appendContent)-64]
		appendContentEncryptionKey, err := userlib.HashKDF(currMetadata.FileContentSourceKey, []byte(currMetadata.Appends[:i+1]+"appendEncryptionKey"))
		appendContentEncryptionKey = appendContentEncryptionKey[:16]
		if err != nil {
			return err
		}
		appendHMACKey, err := userlib.HashKDF(currMetadata.FileContentSourceKey, []byte(currMetadata.Appends[:i+1]+"appendHMACKey"))
		appendHMACKey = appendHMACKey[:16]
		if err != nil {
			return err
		}
		appendHMAC, err := userlib.HMACEval(appendHMACKey, appendContentEncryption)
		if err != nil {
			return err
		}
		appendEquals := userlib.HMACEqual(appendHMAC, appendContent[len(appendContent)-64:])
		if !appendEquals {
			return errors.New("HMAC's do not match, data has been tampered with")
		}
		appendContentData := userlib.SymDec(appendContentEncryptionKey, appendContentEncryption)
		var currAppend FileContent
		err = json.Unmarshal(appendContentData, &currAppend)
		if err != nil {
			return err
		}
		newAppendHash, err := userlib.HashKDF(newFilecontentSourceKey, []byte(currMetadata.Appends[:i+1]))
		newAppendHash = newAppendHash[:16]
		newAppendUUID, err := uuid.FromBytes(newAppendHash)
		if err != nil {
			return err
		}
		newAppendContentData, err := json.Marshal(currAppend)
		if err != nil {
			return err
		}
		newAppendContentIV := userlib.RandomBytes(16)
		newAppendContentEncryptionKey, err := userlib.HashKDF(newFilecontentSourceKey, []byte(currMetadata.Appends[:i+1]+"appendEncryptionKey"))
		newAppendContentEncryptionKey = newAppendContentEncryptionKey[:16]
		if err != nil {
			return err
		}
		newAppendContentHMACKey, err := userlib.HashKDF(newFilecontentSourceKey, []byte(currMetadata.Appends[:i+1]+"appendHMACKey"))
		newAppendContentHMACKey = newAppendContentHMACKey[:16]
		if err != nil {
			return err
		}
		newAppendContentEncryption := userlib.SymEnc(newAppendContentEncryptionKey, newAppendContentIV, newAppendContentData)
		newAppendContentHMAC, err := userlib.HMACEval(newAppendContentHMACKey, newAppendContentEncryption)
		if err != nil {
			return err
		}
		newAppendContent := append(newAppendContentEncryption, newAppendContentHMAC...)
		userlib.DatastoreSet(newAppendUUID, newAppendContent)
		userlib.DatastoreDelete(appendUUID)
	}

	currMetadata.FileContentSourceKey = newFilecontentSourceKey
	currMetadata.FileContentUUID = newFilecontentUUID
	currMetadata.FileContentEncryptionKey = newFilecontentEncryptionKey
	currMetadata.FileContentHMACKey = newFilecontentHMACKey

	currFileStruct.MetadataUUID = newMetadataUUID
	currFileStruct.MetadataEncryptionKey = newMetadataEncryptionKey
	currFileStruct.MetadataHMACKey = newMetadataHMACKey

	updatedSharedFileStruct := File{
		Role:                  "invited",
		MetadataUUID:          currFileStruct.MetadataUUID,
		MetadataEncryptionKey: currFileStruct.MetadataEncryptionKey,
		MetadataHMACKey:       currFileStruct.MetadataHMACKey,
	}
	for key, value := range currMetadata.InvitedList {
		var sharedFileUUID uuid.UUID
		var sharedEncryptionKey []byte
		var sharedHMACKey []byte
		sharedIV := userlib.RandomBytes(16)
		sharedFileData, err := json.Marshal(updatedSharedFileStruct)
		if err != nil {
			return err
		}

		inviteData := currMetadata.InvitedList[key]
		if inviteData.Status == "accepted" {
			sharedFileUUID, err = uuid.FromBytes(userlib.Hash([]byte(inviteData.Filename + key))[:16])
			if err != nil {
				return err
			}
			sharedEncryptionKey, err = userlib.HashKDF(inviteData.SourceKey, []byte("sharedFileEncryptionKey"))
			sharedEncryptionKey = sharedEncryptionKey[:16]
			if err != nil {
				return err
			}
			sharedHMACKey, err = userlib.HashKDF(inviteData.SourceKey, []byte("sharedFileHMACKey"))
			sharedHMACKey = sharedHMACKey[:16]
			if err != nil {
				return err
			}
		} else {
			sharedFileUUID = uuid.New()
			sharedEncryptionKey = userlib.RandomBytes(16)
			sharedHMACKey = userlib.RandomBytes(16)
		}
		sharedEncryption := userlib.SymEnc(sharedEncryptionKey, sharedIV, sharedFileData)
		sharedHMAC, err := userlib.HMACEval(sharedHMACKey, sharedEncryption)
		if err != nil {
			return err
		}
		sharedFile := append(sharedEncryption, sharedHMAC...)
		userlib.DatastoreSet(sharedFileUUID, sharedFile)
		invitationData := Invitation{
			FileUUID:          sharedFileUUID,
			FileEncryptionKey: sharedEncryptionKey,
			FileHMACKey:       sharedHMACKey,
			FileSymKey:        userlib.RandomBytes(16),
		}
		invitationUUID, err := uuid.FromBytes(userlib.Hash([]byte(inviteData.SenderFilename + key + value.Sender))[:16])
		if err != nil {
			return err
		}
		invitationDataStruct, err := json.Marshal(invitationData)
		if err != nil {
			return err
		}
		invitationDataStruct = append(invitationDataStruct, []byte("_"+userdata.Username)...)
		sharedFileSymKey := userlib.RandomBytes(16)
		invitationEncryption := userlib.SymEnc(sharedFileSymKey, userlib.RandomBytes(16), invitationDataStruct)
		recipientPublicKey, ok := userlib.KeystoreGet(key + "_enc")
		if !ok {
			return errors.New("recipient does not exist")
		}
		encryptedSymKey, err := userlib.PKEEnc(recipientPublicKey, sharedFileSymKey)
		if err != nil {
			return err
		}
		invitationSignature, err := userlib.DSSign(userdata.DSSignKey, invitationEncryption)
		invitation := append(encryptedSymKey, invitationEncryption...)
		invitation = append(invitation, invitationSignature...)
		userlib.DatastoreSet(invitationUUID, invitation)
	}

	newfileContentData, err := json.Marshal(currFileContent)
	if err != nil {
		return err
	}
	fileContentIV := userlib.RandomBytes(16)
	currFileContentEncryption := userlib.SymEnc(newFilecontentEncryptionKey, fileContentIV, newfileContentData)
	currFileContentHmac, err := userlib.HMACEval(newFilecontentHMACKey, currFileContentEncryption)
	if err != nil {
		return err
	}
	currFileContentInput := append(currFileContentEncryption, currFileContentHmac...)
	userlib.DatastoreSet(newFilecontentUUID, currFileContentInput)

	fileMetadataData, err = json.Marshal(currMetadata)
	if err != nil {
		return err
	}
	fileMetadataIV := userlib.RandomBytes(16)
	fileMetadataEncryption = userlib.SymEnc(currFileStruct.MetadataEncryptionKey, fileMetadataIV, fileMetadataData)
	fileMetadataHMAC, err := userlib.HMACEval(currFileStruct.MetadataHMACKey, fileMetadataEncryption)
	if err != nil {
		return err
	}
	fileMetadata = append(fileMetadataEncryption, fileMetadataHMAC...)
	userlib.DatastoreSet(currFileStruct.MetadataUUID, fileMetadata)

	fileStructData, err = json.Marshal(currFileStruct)
	if err != nil {
		return err
	}
	fileStructIV := userlib.RandomBytes(16)
	fileStructEncryption = userlib.SymEnc(encKey, fileStructIV, fileStructData)
	fileStructHMAC, err := userlib.HMACEval(hmacKey, fileStructEncryption)
	if err != nil {
		return err
	}
	fileStruct := append(fileStructEncryption, fileStructHMAC...)
	userlib.DatastoreSet(fileStructUUID, fileStruct)
	return err
}
